export default function InstructionManualPage() {
  // 生成图片路径数组
  const imagePaths = Array.from(
    { length: 11 },
    (_, index) =>
      `/printermate/resources/Instruction_manual_${String(index + 1).padStart(
        2,
        '0',
      )}.png`,
  );

  return (
    <div style={styles.container}>
      {imagePaths.map((imagePath, index) => (
        <img
          key={index}
          src={imagePath}
          alt={`说明书第${index + 1}页`}
          style={styles.image}
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
};
