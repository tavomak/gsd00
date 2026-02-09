const Hamburger = ({ open = false, setOpen }) => (
  <button
    type="button"
    className={`z-20 w-10 h-10 border-2 rounded-full ${open ? 'border-white' : 'border-black '}`}
    aria-label="Menu"
    onClick={() => setOpen(!open)}
  >
    <div className="relative grid gap-1 justify-items-center">
      <span
        className={`h-[2px] w-4 rounded-full  transition ${open ? 'bg-white absolute top-1/2 left-1/2 rotate-45 -translate-y-1/2 -translate-x-1/2' : 'bg-black'}`}
      />
      <span
        className={`h-[2px] w-4 rounded-full  transition ${open ? 'bg-white scale-x-0' : 'bg-black'} `}
      />
      <span
        className={`h-[2px] w-4 rounded-full  transition ${open ? 'bg-white absolute top-1/2 left-1/2 -rotate-45 -translate-y-1/2 -translate-x-1/2' : 'bg-black'}`}
      />
    </div>
  </button>
);

export default Hamburger;
