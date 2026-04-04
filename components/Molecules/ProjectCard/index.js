import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

const ProjectCard = ({ project, lang }) => (
  <Link
    href={`${lang === 'es' ? '' : '/en'}/projects/${project?.slug}`}
    className="relative block overflow-hidden border rounded-xl border-neutral-800 group"
  >
    <div className="relative w-full aspect-[16/9]">
      <Image
        src={
          project?.seoMetadata?.seoImage?.url ||
          project?.primaryImage?.url ||
          '/assets/default_project_image.jpg'
        }
        alt={project?.title?.replace(/<[^>]*>/g, '')}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
      />
    </div>
    <motion.div
      className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
      initial={{ opacity: 0, y: 10 }}
      whileHover={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h3 className="text-xl font-bold text-white">{project?.title}</h3>
      {project?.description && (
        <p className="mt-1 text-sm text-neutral-300 line-clamp-2">
          {project.description}
        </p>
      )}
      {project?.category && (
        <span className="inline-block px-3 py-1 mt-3 text-xs font-bold uppercase border rounded-full border-primary-color text-primary-color w-fit">
          {project.category}
        </span>
      )}
    </motion.div>
    <div className="p-4 border-t md:hidden border-neutral-800">
      <h3 className="text-base font-bold transition-colors duration-300 group-hover:text-primary-color">
        {project.title}
      </h3>
    </div>
  </Link>
);

export default ProjectCard;
