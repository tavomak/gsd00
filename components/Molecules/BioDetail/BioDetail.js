import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';
import RichContent from '@/components/Atoms/RichContent';

const BioDetail = ({ item }) => (
  <div className="relative block px-4 mb-4 sm:px-6 lg:px-8">
    <div className="py-4 mb-4 sm:flex sm:justify-around sm:items-center sm:gap-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 sm:text-4xl">
          {item.name}
        </h3>

        <p className="mt-1 font-medium text-gray-600">
          {item.position}
          {item?.linkedin && (
            <a href={item?.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-2xl text-black hover:text-primary-color" />
            </a>
          )}
        </p>
      </div>

      <div className="relative hidden sm:block sm:shrink-0">
        <Image
          src={item.image.url}
          alt={item.name}
          width={250}
          height={250}
          priority
          className="rounded-xl"
          style={{
            width: '250px',
            height: '250px',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />
        {item?.officeTag && (
          <div className="mt-2">
            <span className="px-4 rounded-full bg-primary-color">
              {item?.officeTag}
            </span>
          </div>
        )}
      </div>
    </div>
    <div className="inset-x-0 h-1 bg-primary-color" />
    <div className="py-4 text-black ">
      <RichContent content={item.biography.raw} />
    </div>
  </div>
);

export default BioDetail;
