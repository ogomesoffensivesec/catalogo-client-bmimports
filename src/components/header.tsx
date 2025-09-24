import logo from "@/assets/logo.png"

export default  function Header() {
  return (
    <header className="p-4 flex text-zinc-800 justify-between">
      <div className="px-2">
        <img src={logo} alt="logo" className="w-full h-8" />
      </div>
    </header>
  )
}