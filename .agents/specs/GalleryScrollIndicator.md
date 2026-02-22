# Component: GalleryScrollIndicator

**Layer**: Atom
**Status**: done
**Updated**: 2026-02-22

## What

A fixed-position dot navigation component that syncs with the scroll view gallery, highlighting the currently visible image based on scroll position.

## Props

| Prop         | Type              | Required | Default | Description                                   |
| ------------ | ----------------- | -------- | ------- | --------------------------------------------- |
| `totalItems` | `number`          | yes      | —       | Total number of images in the gallery         |
| `targetRef`  | `React.RefObject` | yes      | —       | Reference to the scrollable gallery container |

## Behavior

- Dots are vertically aligned on the right side of the viewport
- Uses `motion` library's `useScroll` to track scroll progress
- Current active dot is highlighted based on scroll position within the gallery
- Inactive dots appear muted (neutral color)
- Dots are evenly spaced with consistent gap

## Usage

```jsx
import GalleryScrollIndicator from '@/components/Atoms/GalleryScrollIndicator';

const galleryRef = useRef(null);

<div ref={galleryRef}>
  {images.map((image) => (
    <ScrollTriggered key={image.id} ... />
  ))}
</div>

<GalleryScrollIndicator totalItems={images.length} targetRef={galleryRef} />
```

## Acceptance Criteria

- [x] PropTypes defined
- [x] Tailwind-only styling
- [x] Uses motion/react for scroll tracking
- [x] Dots sync with scroll position
- [x] Fixed positioning on right side of viewport
- [x] Visible only when gallery is in scroll view mode (handled by parent)

## Related

- Depends on: `motion/react`
- Used by: `pages/index.js` (in scroll view mode)
