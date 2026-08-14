/**
 * 品牌色卡标识
 *
 * 莫兰迪色点矩阵，呼应「衣橱 = 颜色」。
 */
const DOTS = ['#5A7594', '#7C9A82', '#C08A82', '#C2A878'];

export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const box =
    size === 'lg' ? 'w-12 h-12 rounded-2xl p-2' : size === 'sm' ? 'w-8 h-8 rounded-lg p-1' : 'w-9 h-9 rounded-xl p-1.5';
  const dot = size === 'lg' ? 'w-3.5 h-3.5' : 'w-2 h-2';

  return (
    <div className={`${box} bg-primary-soft grid grid-cols-2 gap-1`}>
      {DOTS.map(c => (
        <span key={c} className={`${dot} rounded-full`} style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}
