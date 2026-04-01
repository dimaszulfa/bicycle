import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Polygon Cascade 4',
    category: 'Mountain Bike',
    price: 3500000,
    stock: 10,
    description: 'Sepeda gunung serbaguna untuk medan off-road ringan dan penggunaan sehari-hari.',
    image: 'https://picsum.photos/seed/mtb-polygon/600/400',
    rating: 4.5,
    reviews: [
      { id: 'r1', userId: 'u1', userName: 'Budi', rating: 5, comment: 'Sangat nyaman digunakan!', date: '2026-03-20' }
    ]
  },
  {
    id: '2',
    name: 'United Detroit 1.0',
    category: 'Mountain Bike',
    price: 2800000,
    stock: 5,
    description: 'Sepeda gunung dengan rangka alloy yang ringan dan tahan lama.',
    image: 'https://picsum.photos/seed/mtb-united/600/400',
    rating: 4.2
  },
  {
    id: '3',
    name: 'Pacific Noris 2.1',
    category: 'Folding Bike',
    price: 4200000,
    stock: 8,
    description: 'Sepeda lipat stylish dengan performa handal untuk mobilitas perkotaan.',
    image: 'https://picsum.photos/seed/folding-bike-pacific/600/400',
    rating: 4.8
  },
  {
    id: '4',
    name: 'Thrill Ravage 5.0',
    category: 'Mountain Bike',
    price: 5500000,
    stock: 3,
    description: 'Sepeda gunung premium untuk performa maksimal di medan berat.',
    image: 'https://picsum.photos/seed/mtb-thrill/600/400',
    rating: 4.7
  },
  {
    id: '5',
    name: 'Wimcycle Pocket Rocket',
    category: 'Folding Bike',
    price: 2500000,
    stock: 12,
    description: 'Sepeda lipat ekonomis namun tetap berkualitas dari Wimcycle.',
    image: 'https://picsum.photos/seed/folding-bike-wimcycle/600/400',
    rating: 4.0
  }
];
