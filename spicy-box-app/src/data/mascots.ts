import type { Mascot } from '../types';

export const INITIAL_MASCOTS: Mascot[] = [
  // --- HALLOWEEN ---
  {
    id: 'hw-1',
    season: 'HALLOWEEN',
    emotion: 'GIAN_DOI',
    name: 'Vịt Bí Ngô: Giận Dỗi',
    image: '/assets/ducks/halloween_gian_doi.png',
    rarity: 'COMMON',
    isUnlocked: true,
    count: 1,
    dropRate: 5
  },
  {
    id: 'hw-2',
    season: 'HALLOWEEN',
    emotion: 'CHAO_HOI',
    name: 'Vịt Bí Ngô: Chào Hỏi (Hello!)',
    image: '/assets/ducks/halloween_chao_hoi.png',
    rarity: 'COMMON',
    isUnlocked: true,
    count: 2,
    dropRate: 25
  },
  {
    id: 'hw-4',
    season: 'HALLOWEEN',
    emotion: 'CHU_MO',
    name: 'Vịt Bí Ngô: Chu Mỏ Nháy Mắt',
    image: '/assets/ducks/halloween_chu_mo.png',
    rarity: 'RARE',
    isUnlocked: true,
    count: 1,
    dropRate: 15
  },
  {
    id: 'hw-5',
    season: 'HALLOWEEN',
    emotion: 'NGAC_NHIEN',
    name: 'Vịt Bí Ngô: Ngạc Nhiên (Cực Hiếm)',
    image: '/assets/ducks/halloween_ngac_nhien.png',
    rarity: 'LEGENDARY',
    isUnlocked: false,
    count: 0,
    dropRate: 10
  },
  // --- CHRISTMAS ---
  {
    id: 'xmas-1',
    season: 'CHRISTMAS',
    emotion: 'GIAN_DOI',
    name: 'Vịt Noel: Giận Dỗi',
    image: '/assets/ducks/christmas_gian_doi.png',
    rarity: 'COMMON',
    isUnlocked: false,
    count: 0,
    dropRate: 5
  },
  {
    id: 'xmas-2',
    season: 'CHRISTMAS',
    emotion: 'CHAO_HOI',
    name: 'Vịt Noel: Chào Hỏi',
    image: '/assets/ducks/christmas_chao_hoi.png',
    rarity: 'COMMON',
    isUnlocked: true,
    count: 1,
    dropRate: 25
  },
  {
    id: 'xmas-4',
    season: 'CHRISTMAS',
    emotion: 'CHU_MO',
    name: 'Vịt Noel: Chu Mỏ',
    image: '/assets/ducks/christmas_chu_mo.png',
    rarity: 'RARE',
    isUnlocked: false,
    count: 0,
    dropRate: 15
  },
  {
    id: 'xmas-5',
    season: 'CHRISTMAS',
    emotion: 'NGAC_NHIEN',
    name: 'Vịt Noel: Ngạc Nhiên Tuyết Rơi',
    image: '/assets/ducks/christmas_ngac_nhien.png',
    rarity: 'LEGENDARY',
    isUnlocked: false,
    count: 0,
    dropRate: 10
  },
  // --- TET ---
  {
    id: 'tet-1',
    season: 'TET',
    emotion: 'GIAN_DOI',
    name: 'Vịt Tết: Giận Dỗi',
    image: '/assets/ducks/tet_gian_doi.png',
    rarity: 'COMMON',
    isUnlocked: false,
    count: 0,
    dropRate: 5
  },
  {
    id: 'tet-2',
    season: 'TET',
    emotion: 'CHAO_HOI',
    name: 'Vịt Tết: Chúc Tết Hello',
    image: '/assets/ducks/tet_chao_hoi.png',
    rarity: 'COMMON',
    isUnlocked: true,
    count: 1,
    dropRate: 25
  },
  {
    id: 'tet-4',
    season: 'TET',
    emotion: 'CHU_MO',
    name: 'Vịt Tết: Chu Mỏ Áo Dài Đỏ',
    image: '/assets/ducks/tet_chu_mo.png',
    rarity: 'RARE',
    isUnlocked: false,
    count: 0,
    dropRate: 15
  },
  {
    id: 'tet-5',
    season: 'TET',
    emotion: 'NGAC_NHIEN',
    name: 'Vịt Tết: Ngạc Nhiên Đón Lộc',
    image: '/assets/ducks/tet_ngac_nhien.png',
    rarity: 'LEGENDARY',
    isUnlocked: false,
    count: 0,
    dropRate: 10
  },
  // --- MIDAUTUMN ---
  {
    id: 'ma-1',
    season: 'MIDAUTUMN',
    emotion: 'GIAN_DOI',
    name: 'Vịt Trung Thu: Giận Dỗi',
    image: '/assets/ducks/midautumn_gian_doi.png',
    rarity: 'COMMON',
    isUnlocked: false,
    count: 0,
    dropRate: 5
  },
  {
    id: 'ma-2',
    season: 'MIDAUTUMN',
    emotion: 'CHAO_HOI',
    name: 'Vịt Trung Thu: Chào Hỏi',
    image: '/assets/ducks/midautumn_chao_hoi.png',
    rarity: 'COMMON',
    isUnlocked: true,
    count: 1,
    dropRate: 25
  },
  {
    id: 'ma-4',
    season: 'MIDAUTUMN',
    emotion: 'CHU_MO',
    name: 'Vịt Trung Thu: Chu Mỏ',
    image: '/assets/ducks/midautumn_chu_mo.png',
    rarity: 'RARE',
    isUnlocked: false,
    count: 0,
    dropRate: 15
  },
  {
    id: 'ma-5',
    season: 'MIDAUTUMN',
    emotion: 'NGAC_NHIEN',
    name: 'Vịt Trung Thu: Ngạc Nhiên Trăng Rằm',
    image: '/assets/ducks/midautumn_ngac_nhien.png',
    rarity: 'LEGENDARY',
    isUnlocked: false,
    count: 0,
    dropRate: 10
  }
];
