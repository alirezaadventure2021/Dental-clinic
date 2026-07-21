import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          خوش آمدید، {user?.name}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          نقش: {user?.role === 'admin' ? 'مدیر' : user?.role}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'بیماران جدید',
            count: '—',
            color: 'bg-amber-50 text-amber-700 border-amber-200',
          },
          {
            title: 'نوبت‌های امروز',
            count: '—',
            color: 'bg-green-50 text-green-700 border-green-200',
          },
          {
            title: 'درمان‌های فعال',
            count: '—',
            color: 'bg-blue-50 text-blue-700 border-blue-200',
          },
          {
            title: 'پرداخت‌ها',
            count: '—',
            color: 'bg-purple-50 text-purple-700 border-purple-200',
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`rounded-xl border p-5 ${card.color} transition-shadow hover:shadow-md`}
          >
            <p className="text-sm font-medium opacity-80">{card.title}</p>
            <p className="text-3xl font-bold mt-2">{card.count}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
