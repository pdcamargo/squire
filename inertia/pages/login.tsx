const LoginPage = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-200 flex justify-center items-center">
        <img
          src="https://via.placeholder.com/600x800"
          alt="Wallpaper"
          className="object-cover max-w-full max-h-full"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center bg-white shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
