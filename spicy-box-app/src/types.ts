export type Season = 'HALLOWEEN' | 'CHRISTMAS' | 'TET' | 'MIDAUTUMN';

export type Emotion = 
  | 'GIAN_DOI' 
  | 'CHAO_HOI' 
  | 'MEU_MAO' 
  | 'CHU_MO' 
  | 'NGAC_NHIEN' 
  | 'VUI_VE';

export interface Mascot {
  id: string;
  season: Season;
  emotion: Emotion;
  name: string;
  image: string;
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY';
  isUnlocked: boolean;
  count: number;
}

export interface QueueItem {
  id: string;
  number: string;
  customerName: string;
  phone: string;
  partySize: number;
  time: string;
  status: 'WAITING' | 'CALLED' | 'SEATED' | 'MISSED';
}

export interface Voucher {
  id: string;
  title: string;
  cost: number;
  icon: string;
  desc: string;
  isRedeemed: boolean;
}
