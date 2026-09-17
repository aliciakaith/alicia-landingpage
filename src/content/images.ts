/**
 * Image slots. A slot left undefined renders the striped placeholder with
 * its mono caption. Sources live in `src/assets/`; the Media component emits
 * <picture> with AVIF + WebP, explicit width/height and lazy loading.
 *
 * Originals (full-page captures, device mockups, screen recordings) are kept
 * in `raw-assets/` (git-ignored). The files here are the sized crops.
 */
import heroAccurate from '../assets/hero-accurate.png';
import heroGlossy from '../assets/hero-glossy.png';
import heroIsola from '../assets/hero-isola.png';
import heroNunani from '../assets/hero-nunani.png';
import studyVisionThumb from '../assets/study-vision-thumb.png';
import studyVisionCrop from '../assets/work-studyvision.png';
import studyVisionPage from '../assets/work-studyvision-page.png';
import workGlossy from '../assets/work-glossy.png';
import workGlueClub from '../assets/work-glueclub.png';
import workIsola from '../assets/work-isola.png';
import workJustLights from '../assets/work-justlights.png';
import workCpap from '../assets/work-cpap.png';
import workKomo from '../assets/work-komo.png';
import arcEden from '../assets/arc-eden.png';
import process1 from '../assets/process-1.png';
import process2 from '../assets/process-2.png';
import process3 from '../assets/process-3.png';
import process4 from '../assets/process-4.png';
import process5 from '../assets/process-5.png';
import aliciaDock from '../assets/alicia-dock.jpg';
import aliciaAvatar from '../assets/alicia-avatar.jpg';
import arcHemel from '../assets/arc-hemel.png';
import arcNunani from '../assets/arc-nunani.png';
import arcStudio9 from '../assets/arc-studio9.png';
import arcOnemed from '../assets/arc-onemed.png';
import arcLyrebird from '../assets/arc-lyrebird.png';

type Slot =
  | 'hero0' | 'hero1' | 'hero2' | 'hero3' | 'heroNote'
  | 'workFeatured' | 'workFeaturedCrop' | 'work0' | 'work1' | 'work2' | 'work3' | 'work4' | 'work5'
  | 'arc0' | 'arc1' | 'arc2' | 'arc3' | 'arc4' | 'arc5'
  | 'process0' | 'process1' | 'process2' | 'process3' | 'process4'
  | 'dockPhoto' | 'dockAvatar';

export const images: Partial<Record<Slot, ImageMetadata>> = {
  // hero fan, back to front (device mockups)
  hero0: heroNunani,
  hero1: heroAccurate,
  hero2: heroGlossy,
  hero3: heroIsola,
  heroNote: studyVisionThumb,

  // work
  workFeatured: studyVisionPage, // tall capture, used when work.featured.pan is on
  workFeaturedCrop: studyVisionCrop,
  work0: workGlossy,
  work1: workGlueClub,
  work2: workIsola,
  work3: workJustLights,
  work4: workCpap,
  work5: workKomo,

  // see-more arc (decorative)
  arc0: arcEden,
  arc1: arcLyrebird,
  arc2: arcNunani,
  arc3: arcStudio9,
  arc4: arcOnemed,
  arc5: arcHemel,

  // process (4:3): device mockups + Glue Club
  process0: process1,
  process1: process2,
  process2: process3,
  process3: process4,
  process4: process5,

  dockPhoto: aliciaDock,
  dockAvatar: aliciaAvatar,
};
