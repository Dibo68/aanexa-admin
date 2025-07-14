export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Aanexa Admin</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Add Customer
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-8">
                <p className="text-gray-500">No customers found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Start by adding your first customer
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
