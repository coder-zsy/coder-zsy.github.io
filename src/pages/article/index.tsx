import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "umi";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
/**
 * rehypeRaw 是一个 Rehype 插件，Rehype 是一个用于处理 HTML 的库。rehypeRaw 的作用是允许生成“原始”（未转义的）HTML 输出，而不是将所有的输入都转换成纯文本节点。这对于希望保留某些由 Markdown 转换工具生成的有效 HTML 标签（例如 <table>、<img> 等）的应用程序非常有用。
当你使用 react-markdown 来解析 Markdown 文本时，默认情况下它会把所有非文本内容当作潜在的安全风险而进行清理，从而避免注入恶意脚本等问题。然而，在一些场景下，你可能需要展示更加复杂的 HTML 结构或者样式，这时就需要借助于像 rehypeRaw 这样的插件来绕过默认的行为，并让最终输出包含更多细节和控制能力。
简而言之，如果你确定你的 Markdown 输入是可信且安全的话，那么通过配置 react-markdown 使用 rehypeRaw 可以帮助你在渲染过程中保持更多的 HTML 元素而不丢失它们原有的功能与表现力。
 * */
import rehypeRaw from "rehype-raw";
// 确保所有输入都是安全的，防止潜在的 XSS 攻击
import rehypeSanitize from "rehype-sanitize";

import MarkNav from "markdown-navbar";
import "markdown-navbar/dist/navbar.css";
import "./index.less";

function CustomHeading({ node, ...props }) {
  // 自定义头部标签样式
  return (
    <h1 style={{ color: "#ff0000", textAlign: "center" }} {...props}>
      {node.children}
    </h1>
  );
}

export default function Article() {
  const [articleContante, setArticleContent] = useState("loading... ...");
  const location = useLocation();
  const params = useParams();
  useEffect(() => {
    getDocContent(location.state.articlePath);
    console.log("==========", location, params);
  }, [location]);

  const getDocContent = (articlePath: string) => {
    fetch(articlePath)
      .then((resp) => resp.text())
      .then((txt) => {
        setArticleContent(txt);
      });
  };

  /**
   * 组件重写：您还可以通过提供 components 对象来自定义每个元素应如何呈现。这允许对输出进行更精细的控制，并且可以在此过程中直接插入 JSX 样式（内联样式）或者引用特定的 React 组件。
   * */
  const customComponents = {
    h1: (props) => <h1 style={{ textAlign: "center" }}>{props.children}</h1>,
    p: (props) => <p>{props.children}</p>, // 自定义普通段落的表现形式
    customType: CustomHeading, // 处理自定义类型的方式
  };

  return (
    <>
      <ReactMarkdown
        className="article-container"
        components={customComponents}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        remarkPlugins={[[gfm, { singleTilde: false }]]}
      >
        {articleContante}
      </ReactMarkdown>
      <MarkNav
        className="article-menu"
        source={articleContante}
        headingTopOffset={80}
        ordered={false}
      />
    </>
  );
}
