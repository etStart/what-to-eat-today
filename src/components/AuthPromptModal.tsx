type AuthPromptModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function AuthPromptModal({
  open,
  onClose,
  onConfirm,
}: AuthPromptModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6 pt-12 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-cocoa-panel px-6 py-6 shadow-premium-card">
        <div className="mb-4 inline-flex rounded-full border border-ember/30 bg-ember/12 px-3 py-1 font-label text-xs text-ember">
          还差一步
        </div>
        <h3 className="font-display text-2xl font-bold text-text-primary">
          登录后开始规划你的餐食
        </h3>
        <p className="mt-3 text-sm leading-7 text-text-secondary">
          当前首页展示的是示例数据。登录后会自动切换成你的真实菜谱和餐计划。
        </p>
        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 font-label text-sm text-text-secondary transition hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            稍后再说
          </button>
          <button
            className="flex-1 rounded-full bg-ember px-4 py-3 font-label text-sm text-white shadow-premium-orange"
            onClick={onConfirm}
            type="button"
          >
            去登录
          </button>
        </div>
      </div>
    </div>
  );
}
