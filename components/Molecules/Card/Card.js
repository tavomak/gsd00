import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';

const Card = ({ item, handleClick }) => (
  <button
    type="button"
    key={item.id}
    className="relative block border cursor-pointer group border-neutral-800 rounded-xl"
    onClick={(e) => handleClick(e, item)}
  >
    <div className="inset-0 block transition-all duration-300 opacity-0 md:absolute bg-emerald-950 overlay group-hover:opacity-50 rounded-xl" />
    <Image
      src={item?.image?.url}
      alt={item?.name}
      width={390}
      height={390}
      className="w-full shadow rounded-xl"
      priority
    />
    <div className="inset-0 p-4 text-white md:justify-end group-hover:flex-col md:hidden md:absolute group-hover:flex">
      <div className="mb-2">
        <span>{item?.linkedin && <FaLinkedin className="text-2xl" />}</span>
      </div>
      <h3 className="text-xl font-bold">{item.name}</h3>
      <p className="text-base font-bold">{item.position}</p>
      <p className="text-base">{item.email}</p>
      {item?.officeTag && (
        <div className="mt-2">
          <span className="px-4 rounded-full bg-primary-color">
            {item?.officeTag}
          </span>
        </div>
      )}
    </div>
  </button>
);

export default Card;
