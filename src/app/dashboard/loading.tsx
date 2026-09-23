export default function Loading() {
  return (
    <div className="w-full px-8 py-5">
      <div className="animate-pulse space-y-4">
        {/* Скелетон для статистики */}
        <div className="h-48 bg-muted rounded-lg" />

        {/* Скелетон для кнопки */}
        <div className="h-10 w-40 bg-muted rounded-md" />

        {/* Скелетон для таблицы */}
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
