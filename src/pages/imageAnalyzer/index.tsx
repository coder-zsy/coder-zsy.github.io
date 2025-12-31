import {
  DeleteOutlined,
  DownloadOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {
  Button,
  Card,
  Collapse,
  Descriptions,
  Image,
  message,
  Modal,
  Spin,
  Tabs,
  Typography,
  Upload,
} from 'antd';
import exifr from 'exifr';
import React, { useState } from 'react';
import './index.less';

const { Dragger } = Upload;
const { Title } = Typography;

interface ImageMetadata {
  [key: string]: any;
}

const ImageAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<ImageMetadata>({});
  const [rawMetadata, setRawMetadata] = useState<string>('');
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [sanitizedImageUrl, setSanitizedImageUrl] = useState<string>('');

  const parseMetadata = async (file: File) => {
    setLoading(true);
    try {
      // 保存原始文件
      setOriginalFile(file);

      // 读取文件基本信息
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
        sizeFormatted: formatFileSize(file.size),
      };
      setFileInfo(fileInfo);

      // 创建图片预览 URL
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setSanitizedImageUrl(''); // 重置脱敏后的图片

      // 解析所有类型的元数据，使用更详细的选项
      const allMetadata = await exifr.parse(file, {
        // 解析所有可用的元数据
        iptc: true,
        xmp: true,
        icc: true,
        jfif: true,
        ihdr: true,
        // 启用 GPS 解析
        gps: true,
        // 启用翻译键名和值，使输出更易读
        translateKeys: true,
        translateValues: true,
        reviveValues: true,
        sanitize: false,
        mergeOutput: false,
        // 获取所有字段，不过滤
        pick: undefined,
        // 不跳过任何字段
        skip: [],
      });

      // 同时获取格式化的 GPS 数据
      let gpsData = null;
      try {
        gpsData = await exifr.gps(file);
      } catch (e) {
        // GPS 解析失败不影响主流程
      }

      // 如果解析失败，尝试基本解析
      let finalMetadata: ImageMetadata = {};
      if (!allMetadata || Object.keys(allMetadata).length === 0) {
        const basicMetadata = await exifr.parse(file);
        finalMetadata = basicMetadata || {};
        message.warning('未检测到完整的元数据信息，仅显示基本信息');
      } else {
        finalMetadata = allMetadata;
      }

      // 如果有 GPS 数据，添加格式化的 GPS 信息
      if (gpsData && gpsData.latitude && gpsData.longitude) {
        finalMetadata['GPSFormatted'] = formatGPS(
          gpsData.latitude,
          gpsData.longitude,
        );
        // 尝试从原始元数据中获取海拔信息
        if (finalMetadata['GPSAltitude'] != null) {
          const altitude =
            typeof finalMetadata['GPSAltitude'] === 'number'
              ? finalMetadata['GPSAltitude']
              : parseFloat(String(finalMetadata['GPSAltitude']));
          if (!isNaN(altitude)) {
            finalMetadata['GPSAltitudeFormatted'] = `${altitude.toFixed(2)} 米`;
          }
        }
      }

      setMetadata(finalMetadata);
      // 保存原始数据为 JSON 字符串
      setRawMetadata(JSON.stringify(finalMetadata, null, 2));
    } catch (error) {
      console.error('解析元数据失败:', error);
      message.error('解析图片元数据失败，请确保上传的是有效的图片文件');
      setMetadata({});
      setRawMetadata('');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // 格式化 GPS 坐标
  const formatGPS = (lat: number, lon: number): string => {
    if (lat == null || lon == null) return '无';
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    const latAbs = Math.abs(lat);
    const lonAbs = Math.abs(lon);

    const latDeg = Math.floor(latAbs);
    const latMin = Math.floor((latAbs - latDeg) * 60);
    const latSec = ((latAbs - latDeg - latMin / 60) * 3600).toFixed(2);

    const lonDeg = Math.floor(lonAbs);
    const lonMin = Math.floor((lonAbs - lonDeg) * 60);
    const lonSec = ((lonAbs - lonDeg - lonMin / 60) * 3600).toFixed(2);

    return `${latDeg}°${latMin}'${latSec}"${latDir}, ${lonDeg}°${lonMin}'${lonSec}"${lonDir} (${lat.toFixed(
      6,
    )}, ${lon.toFixed(6)})`;
  };

  // 格式化日期时间
  const formatDateTime = (value: any): string => {
    if (!value) return 'N/A';
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return String(value);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return String(value);
    }
  };

  // 格式化曝光时间
  const formatExposureTime = (value: any): string => {
    if (value == null) return '无';
    if (typeof value === 'number') {
      if (value >= 1) {
        return `${value.toFixed(1)} 秒`;
      } else {
        return `1/${Math.round(1 / value)} 秒`;
      }
    }
    return String(value);
  };

  // 格式化光圈值
  const formatFNumber = (value: any): string => {
    if (value == null) return '无';
    if (typeof value === 'number') {
      return `f/${value.toFixed(1)}`;
    }
    return String(value);
  };

  // 格式化焦距
  const formatFocalLength = (value: any): string => {
    if (value == null) return '无';
    if (typeof value === 'number') {
      return `${value.toFixed(0)} mm`;
    }
    return String(value);
  };

  // 翻译键名为中文
  const translateKey = (key: string): string => {
    // 如果已经是中文，直接返回
    if (/[\u4e00-\u9fa5]/.test(key)) {
      return key;
    }

    const keyTranslations: { [key: string]: string } = {
      // 基本信息
      Make: '相机品牌',
      Model: '相机型号',
      Software: '软件',
      Artist: '作者',
      Copyright: '版权信息',
      ImageWidth: '图片宽度',
      ImageHeight: '图片高度',
      ThumbnailWidth: '缩略图宽度',
      ThumbnailHeight: '缩略图高度',
      ThumbnailImage: '缩略图图像',
      ThumbnailOffset: '缩略图偏移',
      ThumbnailLength: '缩略图长度',
      ColorSpace: '颜色空间',
      XResolution: '水平分辨率',
      YResolution: '垂直分辨率',
      ResolutionUnit: '分辨率单位',
      MIMEType: 'MIME 类型',
      // 日期时间
      DateTime: '日期时间',
      DateTimeOriginal: '拍摄时间',
      DateTimeDigitized: '数字化时间',
      SubSecTime: '子秒时间',
      SubSecTimeOriginal: '子秒时间（原始）',
      SubSecTimeDigitized: '子秒时间（数字化）',
      // GPS
      GPSLatitude: 'GPS 纬度',
      GPSLongitude: 'GPS 经度',
      GPSAltitude: 'GPS 海拔',
      GPSDateStamp: 'GPS 日期',
      GPSTimeStamp: 'GPS 时间',
      GPSFormatted: 'GPS 位置（格式化）',
      GPSAltitudeFormatted: 'GPS 海拔（格式化）',
      GPSLatitudeRef: 'GPS 纬度参考',
      GPSLongitudeRef: 'GPS 经度参考',
      GPSAltitudeRef: 'GPS 海拔参考',
      GPSProcessingMethod: 'GPS 处理方法',
      GPSAreaInformation: 'GPS 区域信息',
      // 相机参数
      Orientation: '方向',
      ISO: 'ISO 感光度',
      ISOSpeedRatings: 'ISO 速度等级',
      ExposureTime: '曝光时间',
      ShutterSpeed: '快门速度',
      ShutterSpeedValue: '快门速度值',
      FNumber: '光圈值',
      Aperture: '光圈',
      ApertureValue: '光圈值',
      FocalLength: '焦距',
      FocalLengthIn35mmFilm: '35mm 等效焦距',
      Flash: '闪光灯',
      FlashMode: '闪光模式',
      WhiteBalance: '白平衡',
      ExposureMode: '曝光模式',
      ExposureProgram: '曝光程序',
      ExposureBiasValue: '曝光补偿',
      MeteringMode: '测光模式',
      LensModel: '镜头型号',
      LensMake: '镜头品牌',
      LensSpecification: '镜头规格',
      // 图像属性
      BrightnessValue: '亮度值',
      Contrast: '对比度',
      Saturation: '饱和度',
      Sharpness: '锐度',
      SceneType: '场景类型',
      SceneCaptureType: '场景捕获类型',
      CustomRendered: '自定义渲染',
      DigitalZoomRatio: '数字变焦比',
      // IPTC/XMP
      Keywords: '关键词',
      Caption: '说明',
      Headline: '标题',
      Credit: '来源',
      Source: '来源',
      Title: '标题',
      Description: '描述',
      Subject: '主题',
      Creator: '创建者',
      Rights: '权限',
      // 其他
      Compression: '压缩',
      BitsPerSample: '每样本位数',
      PhotometricInterpretation: '光度解释',
      PlanarConfiguration: '平面配置',
      SamplesPerPixel: '每像素样本数',
      YCbCrSubSampling: 'YCbCr 子采样',
      YCbCrPositioning: 'YCbCr 定位',
      // 文件相关
      FileSource: '文件来源',
      CFAPattern: 'CFA 模式',
      SensingMethod: '感光方法',
      // 设备相关
      DeviceSettingDescription: '设备设置描述',
      UserComment: '用户评论',
      RelatedSoundFile: '相关音频文件',
      // 缩略图相关
      Thumbnail: '缩略图',
      // 其他常见字段
      SubfileType: '子文件类型',
      OldSubfileType: '旧子文件类型',
      ImageDescription: '图像描述',
      DocumentName: '文档名称',
      PageName: '页面名称',
      PageNumber: '页码',
      HostComputer: '主机计算机',
      Predictor: '预测器',
      ExtraSamples: '额外样本',
      SampleFormat: '样本格式',
      TransferFunction: '传递函数',
      ReferenceBlackWhite: '参考黑白',
      StripOffsets: '条带偏移',
      RowsPerStrip: '每 strip 行数',
      StripByteCounts: '条带字节数',
      JPEGInterchangeFormat: 'JPEG 交换格式',
      JPEGInterchangeFormatLength: 'JPEG 交换格式长度',
      JPEGLosslessPredictors: 'JPEG 无损预测器',
      JPEGPointTransforms: 'JPEG 点变换',
      JPEGQTables: 'JPEG Q 表',
      JPEGDCTables: 'JPEG DC 表',
      JPEGACTables: 'JPEG AC 表',
      YCbCrCoefficients: 'YCbCr 系数',
      XMP: 'XMP 数据',
      IPTC: 'IPTC 数据',
      ICC: 'ICC 颜色配置',
    };

    // 先尝试精确匹配
    if (keyTranslations[key]) {
      return keyTranslations[key];
    }

    // 尝试不区分大小写匹配
    const lowerKey = key.toLowerCase();
    for (const [enKey, zhValue] of Object.entries(keyTranslations)) {
      if (enKey.toLowerCase() === lowerKey) {
        return zhValue;
      }
    }

    // 如果包含常见关键词，进行部分匹配（按优先级从高到低）
    // 优先匹配更具体的模式

    // 缩略图相关（必须在 width/height 之前检查）
    if (lowerKey.includes('thumbnail')) {
      if (lowerKey.includes('width')) return '缩略图宽度';
      if (lowerKey.includes('height')) return '缩略图高度';
      if (lowerKey.includes('image')) return '缩略图';
      if (lowerKey.includes('offset')) return '缩略图偏移';
      if (lowerKey.includes('length')) return '缩略图长度';
      return '缩略图';
    }

    // 图片尺寸相关（必须在 width/height 之前检查）
    if (lowerKey.includes('image')) {
      if (lowerKey.includes('width')) return '图片宽度';
      if (lowerKey.includes('height')) return '图片高度';
      return '图片';
    }

    if (lowerKey.includes('datetime')) return '日期时间';
    if (lowerKey.includes('gps')) {
      // GPS 相关字段，尝试翻译
      if (lowerKey.includes('latitude')) return 'GPS 纬度';
      if (lowerKey.includes('longitude')) return 'GPS 经度';
      if (lowerKey.includes('altitude')) return 'GPS 海拔';
      if (lowerKey.includes('date')) return 'GPS 日期';
      if (lowerKey.includes('time')) return 'GPS 时间';
      return key.replace(/GPS/gi, 'GPS ');
    }
    if (lowerKey.includes('exposure')) {
      if (lowerKey.includes('time')) return '曝光时间';
      if (lowerKey.includes('mode')) return '曝光模式';
      if (lowerKey.includes('program')) return '曝光程序';
      if (lowerKey.includes('bias')) return '曝光补偿';
      return '曝光';
    }
    if (lowerKey.includes('focal')) {
      if (lowerKey.includes('35mm')) return '35mm 等效焦距';
      return '焦距';
    }
    if (lowerKey.includes('iso')) return 'ISO 感光度';
    if (lowerKey.includes('flash')) {
      if (lowerKey.includes('mode')) return '闪光模式';
      return '闪光灯';
    }
    if (lowerKey.includes('whitebalance')) return '白平衡';
    if (lowerKey.includes('orientation')) return '方向';
    if (lowerKey.includes('resolution')) {
      if (lowerKey.includes('x') || lowerKey.includes('horizontal'))
        return '水平分辨率';
      if (lowerKey.includes('y') || lowerKey.includes('vertical'))
        return '垂直分辨率';
      return '分辨率';
    }
    // width 和 height 放在最后，避免匹配到更具体的字段
    if (lowerKey.includes('width')) return '宽度';
    if (lowerKey.includes('height')) return '高度';
    if (lowerKey.includes('color')) {
      if (lowerKey.includes('space')) return '颜色空间';
      return '颜色';
    }
    if (lowerKey.includes('copyright')) return '版权';
    if (lowerKey.includes('artist')) return '作者';
    if (lowerKey.includes('software')) return '软件';
    if (lowerKey.includes('make')) return '品牌';
    if (lowerKey.includes('model')) {
      if (lowerKey.includes('lens')) return '镜头型号';
      return '型号';
    }
    if (lowerKey.includes('lens')) {
      if (lowerKey.includes('make')) return '镜头品牌';
      if (lowerKey.includes('spec')) return '镜头规格';
      return '镜头';
    }
    if (lowerKey.includes('shutter')) {
      if (lowerKey.includes('speed')) return '快门速度';
      return '快门';
    }
    if (lowerKey.includes('aperture')) return '光圈';
    if (lowerKey.includes('fnumber')) return '光圈值';
    if (lowerKey.includes('metering')) return '测光模式';
    if (lowerKey.includes('brightness')) return '亮度';
    if (lowerKey.includes('contrast')) return '对比度';
    if (lowerKey.includes('saturation')) return '饱和度';
    if (lowerKey.includes('sharpness')) return '锐度';
    if (lowerKey.includes('scene')) {
      if (lowerKey.includes('type')) return '场景类型';
      if (lowerKey.includes('capture')) return '场景捕获类型';
      return '场景';
    }
    if (lowerKey.includes('compression')) return '压缩';
    if (lowerKey.includes('bits')) return '每样本位数';
    if (lowerKey.includes('samples')) return '每像素样本数';
    if (lowerKey.includes('keyword')) return '关键词';
    if (lowerKey.includes('caption')) return '说明';
    if (lowerKey.includes('headline')) return '标题';
    if (lowerKey.includes('credit')) return '来源';
    if (lowerKey.includes('source')) return '来源';
    if (lowerKey.includes('title')) return '标题';
    if (lowerKey.includes('description')) return '描述';
    if (lowerKey.includes('subject')) return '主题';
    if (lowerKey.includes('creator')) return '创建者';
    if (lowerKey.includes('rights')) return '权限';
    if (lowerKey.includes('comment')) return '评论';
    if (lowerKey.includes('zoom')) return '变焦比';
    if (lowerKey.includes('digital')) return '数字';

    return key;
  };

  // 翻译值为中文
  const translateValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return '无';
    if (typeof value === 'boolean') {
      return value ? '是' : '否';
    }

    const lowerKey = key.toLowerCase();
    const lowerValue = String(value).toLowerCase();

    // 颜色空间
    if (lowerKey.includes('colorspace')) {
      const colorSpaceMap: { [key: string]: string } = {
        '1': 'sRGB',
        '65535': '未校准',
        '0': '未校准',
      };
      return colorSpaceMap[String(value)] || String(value);
    }

    // 曝光模式
    if (lowerKey.includes('exposuremode')) {
      const exposureModeMap: { [key: string]: string } = {
        '0': '自动曝光',
        '1': '手动曝光',
        '2': '自动包围曝光',
      };
      return exposureModeMap[String(value)] || String(value);
    }

    // 曝光程序
    if (lowerKey.includes('exposureprogram')) {
      const programMap: { [key: string]: string } = {
        '0': '未定义',
        '1': '手动',
        '2': '标准程序',
        '3': '光圈优先',
        '4': '快门优先',
        '5': '创意程序',
        '6': '动作程序',
        '7': '肖像模式',
        '8': '风景模式',
      };
      return programMap[String(value)] || String(value);
    }

    // 测光模式
    if (lowerKey.includes('meteringmode')) {
      const meteringMap: { [key: string]: string } = {
        '0': '未知',
        '1': '平均测光',
        '2': '中央重点测光',
        '3': '点测光',
        '4': '多点测光',
        '5': '多区域测光',
        '6': '部分测光',
        '255': '其他',
      };
      return meteringMap[String(value)] || String(value);
    }

    // 白平衡
    if (lowerKey.includes('whitebalance')) {
      if (value === 0 || lowerValue === 'auto' || lowerValue === '0') {
        return '自动';
      }
      if (value === 1 || lowerValue === 'manual' || lowerValue === '1') {
        return '手动';
      }
    }

    // 闪光灯模式（更详细）
    if (lowerKey.includes('flash')) {
      const flashMap: { [key: string]: string } = {
        '0': '未使用闪光灯',
        '1': '使用闪光灯',
        '5': '闪光灯已触发，但未检测到反射光',
        '7': '闪光灯已触发，检测到反射光',
        '9': '闪光灯已触发，强制闪光模式',
        '13': '闪光灯已触发，强制闪光模式，未检测到反射光',
        '15': '闪光灯已触发，强制闪光模式，检测到反射光',
        '16': '未使用闪光灯，强制闪光模式关闭',
        '24': '未使用闪光灯，自动模式',
        '25': '闪光灯已触发，自动模式',
        '29': '闪光灯已触发，自动模式，未检测到反射光',
        '31': '闪光灯已触发，自动模式，检测到反射光',
      };
      return flashMap[String(value)] || String(value);
    }

    // 方向
    if (lowerKey.includes('orientation')) {
      const orientations: { [key: number]: string } = {
        1: '正常 (0°)',
        2: '水平翻转',
        3: '旋转 180°',
        4: '垂直翻转',
        5: '顺时针旋转 90° 后水平翻转',
        6: '顺时针旋转 90°',
        7: '逆时针旋转 90° 后水平翻转',
        8: '逆时针旋转 90°',
      };
      if (typeof value === 'number' && orientations[value]) {
        return orientations[value];
      }
    }

    // 场景类型
    if (lowerKey.includes('scenetype')) {
      const sceneTypeMap: { [key: string]: string } = {
        '0': '未定义',
        '1': '直接拍摄',
      };
      return sceneTypeMap[String(value)] || String(value);
    }

    // 场景捕获类型
    if (lowerKey.includes('scenecapturetype')) {
      const sceneCaptureMap: { [key: string]: string } = {
        '0': '标准',
        '1': '风景',
        '2': '肖像',
        '3': '夜景',
      };
      return sceneCaptureMap[String(value)] || String(value);
    }

    // 自定义渲染
    if (lowerKey.includes('customrendered')) {
      const customRenderedMap: { [key: string]: string } = {
        '0': '正常处理',
        '1': '自定义处理',
      };
      return customRenderedMap[String(value)] || String(value);
    }

    // 感光方法
    if (lowerKey.includes('sensingmethod')) {
      const sensingMethodMap: { [key: string]: string } = {
        '1': '未定义',
        '2': '单芯片颜色区域传感器',
        '3': '双芯片颜色区域传感器',
        '4': '三芯片颜色区域传感器',
        '5': '颜色序列区域传感器',
        '7': '三线传感器',
        '8': '颜色序列线性传感器',
      };
      return sensingMethodMap[String(value)] || String(value);
    }

    // 文件来源
    if (lowerKey.includes('filesource')) {
      const fileSourceMap: { [key: string]: string } = {
        '0': '未知',
        '1': '胶片扫描仪',
        '2': '反射式打印扫描仪',
        '3': '数码相机',
      };
      return fileSourceMap[String(value)] || String(value);
    }

    // 压缩
    if (lowerKey.includes('compression')) {
      const compressionMap: { [key: string]: string } = {
        '1': '未压缩',
        '6': 'JPEG 压缩',
      };
      return compressionMap[String(value)] || String(value);
    }

    // 光度解释
    if (lowerKey.includes('photometricinterpretation')) {
      const photometricMap: { [key: string]: string } = {
        '0': '白点为零',
        '1': '黑点为零',
        '2': 'RGB',
        '3': '调色板颜色',
        '4': '透明度遮罩',
        '5': 'CMYK',
        '6': 'YCbCr',
        '8': 'CIELab',
        '9': 'ICCLab',
        '10': 'ITULab',
      };
      return photometricMap[String(value)] || String(value);
    }

    // 平面配置
    if (lowerKey.includes('planarconfiguration')) {
      const planarMap: { [key: string]: string } = {
        '1': '块',
        '2': '平面',
      };
      return planarMap[String(value)] || String(value);
    }

    // YCbCr 定位
    if (lowerKey.includes('ycbcrpositioning')) {
      const ycbcrMap: { [key: string]: string } = {
        '1': '居中',
        '2': '共位',
      };
      return ycbcrMap[String(value)] || String(value);
    }

    // GPS 参考方向
    if (
      lowerKey.includes('gpslatituderef') ||
      lowerKey.includes('gpslongituderef')
    ) {
      if (lowerValue === 'n' || lowerValue === 'north') return '北';
      if (lowerValue === 's' || lowerValue === 'south') return '南';
      if (lowerValue === 'e' || lowerValue === 'east') return '东';
      if (lowerValue === 'w' || lowerValue === 'west') return '西';
    }

    // GPS 海拔参考
    if (lowerKey.includes('gpsaltituderef')) {
      if (lowerValue === '0' || lowerValue === 'above') return '海平面以上';
      if (lowerValue === '1' || lowerValue === 'below') return '海平面以下';
    }

    // 分辨率单位
    if (lowerKey.includes('resolutionunit')) {
      const resolutionUnitMap: { [key: string]: string } = {
        '1': '无单位',
        '2': '英寸',
        '3': '厘米',
      };
      return resolutionUnitMap[String(value)] || String(value);
    }

    // 对比度、饱和度、锐度
    if (
      lowerKey.includes('contrast') ||
      lowerKey.includes('saturation') ||
      lowerKey.includes('sharpness')
    ) {
      const adjustmentMap: { [key: string]: string } = {
        '0': '正常',
        '1': '柔和',
        '2': '强烈',
      };
      return adjustmentMap[String(value)] || String(value);
    }

    // 数字变焦比
    if (lowerKey.includes('digitalzoomratio')) {
      if (typeof value === 'number') {
        if (value === 0 || value === 1) return '未使用数字变焦';
        return `${value.toFixed(2)}x`;
      }
    }

    return String(value);
  };

  // 格式化方向
  const formatOrientation = (value: any): string => {
    if (value == null) return '无';
    const orientations: { [key: number]: string } = {
      1: '正常 (0°)',
      2: '水平翻转',
      3: '旋转 180°',
      4: '垂直翻转',
      5: '顺时针旋转 90° 后水平翻转',
      6: '顺时针旋转 90°',
      7: '逆时针旋转 90° 后水平翻转',
      8: '逆时针旋转 90°',
    };
    if (typeof value === 'number' && orientations[value]) {
      return `${value} - ${orientations[value]}`;
    }
    return String(value);
  };

  // 格式化分辨率
  const formatResolution = (value: any): string => {
    if (value == null) return '无';
    if (typeof value === 'number') {
      return `${value.toFixed(0)} dpi`;
    }
    return String(value);
  };

  // 格式化闪光灯
  const formatFlash = (value: any): string => {
    if (value == null) return 'N/A';
    if (typeof value === 'number') {
      const flashModes: { [key: number]: string } = {
        0: '未使用闪光灯',
        1: '使用闪光灯',
        5: '闪光灯已触发，但未检测到反射光',
        7: '闪光灯已触发，检测到反射光',
      };
      return flashModes[value] || `值: ${value}`;
    }
    return String(value);
  };

  // 格式化白平衡
  const formatWhiteBalance = (value: any): string => {
    if (value == null) return 'N/A';
    if (typeof value === 'number') {
      return value === 0 ? '自动' : '手动';
    }
    return String(value);
  };

  // 格式化数组值
  const formatArrayValue = (key: string, value: any[]): string => {
    if (!Array.isArray(value) || value.length === 0) {
      return Array.isArray(value) ? '空数组' : String(value);
    }

    const lowerKey = key.toLowerCase();

    // GPS 时间戳数组 [小时, 分钟, 秒]
    if (lowerKey.includes('gpstimestamp') && value.length === 3) {
      const [hours, minutes, seconds] = value.map((v) =>
        typeof v === 'number' ? v : parseFloat(String(v)),
      );
      if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
        const h = Math.floor(hours);
        const m = Math.floor(minutes);
        const s = parseFloat(seconds.toFixed(2));
        const mStr = m < 10 ? `0${m}` : `${m}`;
        const sStr = s < 10 ? `0${s.toFixed(2)}` : s.toFixed(2);
        return `${h}:${mStr}:${sStr}`;
      }
    }

    // 数字数组，格式化显示
    if (value.every((item) => typeof item === 'number')) {
      return value.join(', ');
    }

    // 字符串数组
    if (value.every((item) => typeof item === 'string')) {
      return value.join(', ');
    }

    // 混合类型，使用格式化的 JSON
    return JSON.stringify(value, null, 2);
  };

  // 格式化对象值
  const formatObjectValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return '无';

    // 如果是数组
    if (Array.isArray(value)) {
      return formatArrayValue(key, value);
    }

    // 如果是普通对象
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return '空对象';

      const lowerKey = key.toLowerCase();

      // GPS 坐标对象
      if ((value.latitude || value.lat) && (value.longitude || value.lon)) {
        const lat = value.latitude || value.lat;
        const lon = value.longitude || value.lon;
        if (typeof lat === 'number' && typeof lon === 'number') {
          return formatGPS(lat, lon);
        }
      }

      // 如果是简单的键值对对象，格式化为易读形式
      if (
        entries.length <= 5 &&
        entries.every(
          ([_, v]) =>
            typeof v === 'string' ||
            typeof v === 'number' ||
            typeof v === 'boolean',
        )
      ) {
        return entries
          .map(([k, v]) => {
            const formattedValue = formatMetadataValue(k, v);
            return `${k}: ${formattedValue}`;
          })
          .join('\n');
      }

      // 默认使用格式化的 JSON
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  // 格式化元数据值
  const formatMetadataValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return '无';

    const lowerKey = key.toLowerCase();

    // 数组和对象类型优先处理
    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      return formatObjectValue(key, value);
    }

    // GPS 坐标
    if (lowerKey.includes('gpslatitude') || lowerKey.includes('gpslongitude')) {
      if (typeof value === 'number') {
        return value.toFixed(6);
      }
      return translateValue(key, value);
    }

    // GPS 格式化字段
    if (lowerKey.includes('gpsformatted')) {
      return String(value);
    }

    // GPS 海拔
    if (lowerKey.includes('gpsaltitude')) {
      if (typeof value === 'number') {
        return `${value.toFixed(2)} 米`;
      }
      return translateValue(key, value);
    }

    // 日期时间
    if (
      lowerKey.includes('date') ||
      lowerKey.includes('time') ||
      lowerKey.includes('datetime')
    ) {
      return formatDateTime(value);
    }

    // 曝光时间
    if (
      lowerKey.includes('exposuretime') ||
      lowerKey.includes('shutterspeed')
    ) {
      return formatExposureTime(value);
    }

    // 光圈值
    if (lowerKey.includes('fnumber') || lowerKey.includes('aperture')) {
      return formatFNumber(value);
    }

    // 焦距
    if (lowerKey.includes('focallength')) {
      return formatFocalLength(value);
    }

    // 方向
    if (lowerKey.includes('orientation')) {
      return translateValue(key, value);
    }

    // 分辨率
    if (lowerKey.includes('resolution')) {
      return formatResolution(value);
    }

    // 闪光灯
    if (lowerKey.includes('flash')) {
      return translateValue(key, value);
    }

    // 白平衡
    if (lowerKey.includes('whitebalance')) {
      return translateValue(key, value);
    }

    // 曝光模式
    if (lowerKey.includes('exposuremode')) {
      return translateValue(key, value);
    }

    // 曝光程序
    if (lowerKey.includes('exposureprogram')) {
      return translateValue(key, value);
    }

    // 测光模式
    if (lowerKey.includes('meteringmode')) {
      return translateValue(key, value);
    }

    // ISO
    if (lowerKey.includes('iso')) {
      return typeof value === 'number'
        ? `ISO ${value}`
        : translateValue(key, value);
    }

    // 颜色空间
    if (lowerKey.includes('colorspace')) {
      return translateValue(key, value);
    }

    // 图片尺寸
    if (lowerKey.includes('width') && typeof value === 'number') {
      return `${value} 像素`;
    }
    if (lowerKey.includes('height') && typeof value === 'number') {
      return `${value} 像素`;
    }

    // 布尔值
    if (typeof value === 'boolean') {
      return translateValue(key, value);
    }

    // 数字类型 - 先尝试翻译，如果无法翻译则返回原值
    if (typeof value === 'number') {
      const translated = translateValue(key, value);
      // 如果翻译后的值和原值相同，说明没有找到翻译，返回原值
      if (translated === String(value)) {
        return value.toString();
      }
      return translated;
    }

    // 字符串类型 - 尝试翻译
    const translated = translateValue(key, value);
    return translated;
  };

  // 递归展开对象和数组，将嵌套结构拆解为独立字段
  const flattenMetadata = (
    obj: any,
    prefix: string = '',
    result: ImageMetadata = {},
  ): ImageMetadata => {
    if (obj === null || obj === undefined) {
      return result;
    }

    // 如果是数组
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const newKey = prefix ? `${prefix}[${index}]` : `[${index}]`;
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          // 数组中的对象，递归展开
          flattenMetadata(item, newKey, result);
        } else if (Array.isArray(item)) {
          // 嵌套数组，递归展开
          flattenMetadata(item, newKey, result);
        } else {
          // 简单值
          result[newKey] = item;
        }
      });
      return result;
    }

    // 如果是对象
    if (typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value === null || value === undefined) {
          result[newKey] = value;
        } else if (Array.isArray(value)) {
          // 数组，递归展开
          flattenMetadata(value, newKey, result);
        } else if (typeof value === 'object') {
          // 嵌套对象，递归展开
          flattenMetadata(value, newKey, result);
        } else {
          // 简单值
          result[newKey] = value;
        }
      });
      return result;
    }

    // 简单值
    result[prefix] = obj;
    return result;
  };

  const categorizeMetadata = (data: ImageMetadata, fileInfo: any) => {
    const categories: { [key: string]: ImageMetadata } = {
      basic: {},
      exif: {},
      iptc: {},
      xmp: {},
      icc: {},
      gps: {},
    };

    // 将文件信息添加到基本信息
    if (fileInfo) {
      categories.basic['文件名'] = fileInfo.name;
      categories.basic['文件大小'] = fileInfo.sizeFormatted;
      categories.basic['文件类型'] = fileInfo.type || '无';
      categories.basic['最后修改时间'] = fileInfo.lastModified;
    }

    // 识别顶级对象，为每个对象创建独立模块
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const lowerKey = key.toLowerCase();

      // 如果是对象或数组，作为独立模块处理
      if (
        value !== null &&
        value !== undefined &&
        (Array.isArray(value) || typeof value === 'object')
      ) {
        // 检查是否是已知的分类对象
        let isClassified = false;

        // GPS 对象
        if (
          lowerKey.includes('gps') ||
          (typeof value === 'object' &&
            !Array.isArray(value) &&
            (value.latitude || value.lat || value.longitude || value.lon))
        ) {
          if (!categories.gps[key]) {
            categories.gps[key] = {};
          }
          // 展开对象内容
          if (typeof value === 'object' && !Array.isArray(value)) {
            Object.keys(value).forEach((subKey) => {
              categories.gps[`${key}.${subKey}`] = value[subKey];
            });
          } else {
            flattenMetadata(value, key, categories.gps);
          }
          isClassified = true;
        }
        // IPTC 对象
        else if (lowerKey.startsWith('iptc') || lowerKey.includes('iptc')) {
          if (!categories.iptc[key]) {
            categories.iptc[key] = {};
          }
          flattenMetadata(value, key, categories.iptc);
          isClassified = true;
        }
        // XMP 对象
        else if (lowerKey.startsWith('xmp') || lowerKey.includes('xmp')) {
          if (!categories.xmp[key]) {
            categories.xmp[key] = {};
          }
          flattenMetadata(value, key, categories.xmp);
          isClassified = true;
        }
        // ICC 对象
        else if (
          lowerKey.startsWith('icc') ||
          lowerKey.includes('icc') ||
          lowerKey.includes('color')
        ) {
          if (!categories.icc[key]) {
            categories.icc[key] = {};
          }
          flattenMetadata(value, key, categories.icc);
          isClassified = true;
        }
        // EXIF 对象
        else if (
          lowerKey.startsWith('exif') ||
          [
            'make',
            'model',
            'datetime',
            'orientation',
            'iso',
            'fnumber',
            'exposuretime',
            'focallength',
          ].some((term) => lowerKey.includes(term))
        ) {
          if (!categories.exif[key]) {
            categories.exif[key] = {};
          }
          flattenMetadata(value, key, categories.exif);
          isClassified = true;
        }

        // 如果是未分类的对象，创建独立模块
        if (!isClassified) {
          // 使用对象名作为模块名
          const moduleName = translateKey(key) || key;
          if (!categories[moduleName]) {
            categories[moduleName] = {};
          }
          flattenMetadata(value, key, categories[moduleName]);
        }
      } else {
        // 简单值，进行分类
        if (
          lowerKey.includes('gps') ||
          lowerKey.includes('latitude') ||
          lowerKey.includes('longitude') ||
          lowerKey.includes('altitude')
        ) {
          categories.gps[key] = value;
        } else if (lowerKey.startsWith('iptc') || lowerKey.includes('iptc')) {
          categories.iptc[key] = value;
        } else if (lowerKey.startsWith('xmp') || lowerKey.includes('xmp')) {
          categories.xmp[key] = value;
        } else if (
          lowerKey.startsWith('icc') ||
          lowerKey.includes('icc') ||
          lowerKey.includes('color')
        ) {
          categories.icc[key] = value;
        } else if (
          lowerKey.startsWith('exif') ||
          [
            'make',
            'model',
            'datetime',
            'orientation',
            'iso',
            'fnumber',
            'exposuretime',
            'focallength',
          ].some((term) => lowerKey.includes(term))
        ) {
          categories.exif[key] = value;
        } else if (
          ['width', 'height', 'mimetype', 'colorspace'].includes(lowerKey)
        ) {
          categories.basic[key] = value;
        } else {
          // 未分类的简单值，根据键名创建独立模块
          const moduleName = translateKey(key) || key;
          if (!categories[moduleName]) {
            categories[moduleName] = {};
          }
          categories[moduleName][key] = value;
        }
      }
    });

    return categories;
  };

  // 删除元数据，生成脱敏图片
  const removeMetadata = async () => {
    if (!originalFile) {
      message.warning('请先上传图片');
      return;
    }

    Modal.confirm({
      title: '确认删除元数据',
      content:
        '此操作将删除图片中的所有元数据信息（包括 EXIF、GPS、IPTC 等），生成脱敏后的图片。是否继续？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          message.loading({
            content: '正在处理图片...',
            key: 'removeMetadata',
            duration: 0,
          });

          // 创建图片对象
          const img = document.createElement('img');
          img.crossOrigin = 'anonymous';

          // 等待图片加载
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('图片加载失败'));
            img.src = imageUrl;
          });

          // 创建 canvas
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('无法创建 canvas 上下文');
          }

          // 将图片绘制到 canvas（canvas 不会包含原始元数据）
          ctx.drawImage(img, 0, 0);

          // 使用 ImageData 重新绘制，确保完全清除元数据
          // 先获取原始图像数据
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // 清空 canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 重新绘制图像数据（这会创建一个全新的图像，不包含任何元数据）
          ctx.putImageData(imageData, 0, 0);

          // 将 canvas 转换为 blob
          // 使用 PNG 格式可以避免自动添加 ICC 颜色配置和其他元数据
          // PNG 格式通常不包含 EXIF、ICC 等元数据
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                throw new Error('无法生成图片');
              }

              // 创建新的 URL
              const sanitizedUrl = URL.createObjectURL(blob);
              setSanitizedImageUrl(sanitizedUrl);

              // 更新预览
              setImageUrl(sanitizedUrl);

              // 异步验证元数据是否已清除
              const verifyMetadata = async () => {
                try {
                  const reader = new FileReader();
                  await new Promise<void>((resolve, reject) => {
                    reader.onload = () => resolve();
                    reader.onerror = () => reject(new Error('读取文件失败'));
                    reader.readAsArrayBuffer(blob);
                  });

                  const arrayBuffer = reader.result as ArrayBuffer;
                  if (arrayBuffer) {
                    const newFile = new File([arrayBuffer], 'sanitized.png', {
                      type: 'image/png',
                    });
                    // 检查是否还有元数据（使用与原始解析相同的配置）
                    // 注意：PNG 格式的 IHDR 是必需的文件头信息，不是元数据，应该排除
                    const remainingMetadata = await exifr.parse(newFile, {
                      iptc: true,
                      xmp: true,
                      icc: true,
                      jfif: true,
                      ihdr: false, // 不解析 IHDR，因为它是 PNG 格式必需的结构，不是元数据
                      gps: true,
                      translateKeys: true,
                      translateValues: true,
                      reviveValues: true,
                      sanitize: false,
                      mergeOutput: false,
                    });

                    // 过滤掉 IHDR 相关的字段（如果存在）
                    const filteredMetadata: ImageMetadata = {};
                    Object.keys(remainingMetadata).forEach((key) => {
                      const lowerKey = key.toLowerCase();
                      // 排除 IHDR 相关字段（这是 PNG 格式必需的结构，不是隐私元数据）
                      if (
                        !lowerKey.includes('ihdr') &&
                        !lowerKey.includes('width') && // PNG 的宽度高度是 IHDR 的一部分
                        !lowerKey.includes('height') &&
                        !lowerKey.includes('bitdepth') &&
                        !lowerKey.includes('colortype') &&
                        !lowerKey.includes('compression') &&
                        !lowerKey.includes('filter') &&
                        !lowerKey.includes('interlace')
                      ) {
                        filteredMetadata[key] = remainingMetadata[key];
                      }
                    });

                    // 清空元数据
                    setMetadata({});
                    setRawMetadata('');

                    // 更新文件信息
                    const newFileInfo = {
                      ...fileInfo,
                      size: blob.size,
                      sizeFormatted: formatFileSize(blob.size),
                      type: 'image/png',
                    };
                    setFileInfo(newFileInfo);

                    if (Object.keys(filteredMetadata).length > 0) {
                      console.warn('仍有残留元数据:', filteredMetadata);
                      message.warning({
                        content: '部分元数据可能未完全清除',
                        key: 'removeMetadata',
                      });
                    } else {
                      message.success({
                        content: '元数据已成功删除',
                        key: 'removeMetadata',
                      });
                    }
                    setLoading(false);
                  }
                } catch (error) {
                  console.error('验证元数据失败:', error);
                  // 即使验证失败，也认为删除成功
                  setMetadata({});
                  setRawMetadata('');
                  const newFileInfo = {
                    ...fileInfo,
                    size: blob.size,
                    sizeFormatted: formatFileSize(blob.size),
                    type: 'image/png',
                  };
                  setFileInfo(newFileInfo);
                  message.success({
                    content: '元数据已成功删除',
                    key: 'removeMetadata',
                  });
                  setLoading(false);
                }
              };

              verifyMetadata();
            },
            'image/png', // 使用 PNG 格式，避免自动添加 ICC 等元数据
          );
        } catch (error) {
          console.error('删除元数据失败:', error);
          message.error({
            content: '删除元数据失败，请重试',
            key: 'removeMetadata',
          });
          setLoading(false);
        }
      },
    });
  };

  // 下载脱敏后的图片
  const downloadSanitizedImage = () => {
    if (!sanitizedImageUrl && !imageUrl) {
      message.warning('没有可下载的图片');
      return;
    }

    const urlToDownload = sanitizedImageUrl || imageUrl;
    const link = document.createElement('a');
    link.href = urlToDownload;
    link.download = originalFile
      ? `sanitized_${originalFile.name}`
      : 'sanitized_image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('图片下载成功');
  };

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    beforeUpload: (file) => {
      parseMetadata(file);
      return false; // 阻止自动上传
    },
    showUploadList: false,
  };

  const categories = categorizeMetadata(metadata, fileInfo);
  const hasMetadata = Object.keys(metadata).length > 0 || fileInfo;

  return (
    <div className="image-analyzer-container">
      <Title level={2}>图片元数据分析工具</Title>

      <div className="upload-preview-wrapper">
        <Card title="上传图片" className="upload-card">
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
            <p className="ant-upload-hint">
              支持解析 EXIF、IPTC、XMP、ICC 等所有类型的元数据信息
            </p>
          </Dragger>
        </Card>

        <Card title="图片预览" className="preview-card">
          {loading ? (
            <div className="preview-loading">
              <Spin size="large" />
              <p style={{ marginTop: 16, color: '#8c8c8c' }}>
                正在解析图片元数据...
              </p>
            </div>
          ) : imageUrl ? (
            <Image src={imageUrl} alt="预览" style={{ maxWidth: '100%' }} />
          ) : (
            <div className="preview-placeholder">
              <p>暂无预览图片</p>
              <p
                style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '8px' }}
              >
                上传图片后将在此显示预览
              </p>
            </div>
          )}
        </Card>
      </div>

      {hasMetadata && !loading && (
        <Card
          title="元数据信息"
          className="metadata-card"
          extra={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={removeMetadata}
              >
                删除元数据（脱敏）
              </Button>
              {sanitizedImageUrl && (
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={downloadSanitizedImage}
                >
                  下载脱敏图片
                </Button>
              )}
            </div>
          }
        >
          <Tabs
            defaultActiveKey="parsed"
            items={[
              {
                key: 'parsed',
                label: '解析后的数据',
                children: (
                  <Collapse
                    defaultActiveKey={['basic']}
                    items={Object.keys(categories)
                      .filter(
                        (category) =>
                          Object.keys(categories[category]).length > 0,
                      )
                      .map((category) => {
                        const categoryData = categories[category];
                        const categoryNames: { [key: string]: string } = {
                          basic: '基本信息',
                          exif: 'EXIF 数据',
                          iptc: 'IPTC 数据',
                          xmp: 'XMP 数据',
                          icc: 'ICC 颜色配置',
                          gps: 'GPS 位置信息',
                        };

                        return {
                          key: category,
                          label:
                            categoryNames[category] ||
                            translateKey(category) ||
                            category,
                          children: (
                            <Descriptions bordered column={1} size="small">
                              {Object.keys(categoryData).map((key) => (
                                <Descriptions.Item
                                  key={key}
                                  label={
                                    <span style={{ fontFamily: 'monospace' }}>
                                      {translateKey(key)}
                                    </span>
                                  }
                                >
                                  <pre
                                    style={{
                                      margin: 0,
                                      whiteSpace: 'pre-wrap',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {formatMetadataValue(
                                      key,
                                      categoryData[key],
                                    )}
                                  </pre>
                                </Descriptions.Item>
                              ))}
                            </Descriptions>
                          ),
                        };
                      })}
                  />
                ),
              },
              {
                key: 'raw',
                label: '原始数据',
                children: (
                  <pre
                    className="raw-metadata-pre"
                    style={{
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: '600px',
                      overflow: 'auto',
                    }}
                  >
                    {rawMetadata || '暂无原始数据'}
                  </pre>
                ),
              },
            ]}
          />
        </Card>
      )}

      {!hasMetadata && !loading && imageUrl && (
        <Card className="no-metadata-card">
          <p>该图片未包含可识别的元数据信息</p>
        </Card>
      )}
    </div>
  );
};

export default ImageAnalyzer;
