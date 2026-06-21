const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
dotenv.config();

// Using Unsplash - free, no hotlink blocking, always works
const plants = [
  {
    name: 'Money Plant',
    description: 'A popular indoor plant believed to bring good luck and prosperity. Very easy to grow and maintain. Perfect for beginners.',
    price: 149, originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1620127252536-03bdfbf5e8d5?w=600&q=80',
    category: 'Indoor Plants', stock: 50,
    sunlight: 'Low to Medium', watering: 'Once per week', soil: 'Well drained potting mix',
    difficulty: 'Easy', petFriendly: false, rating: 4.5, numReviews: 20, season: ['All'],
  },
  {
    name: 'Tulsi (Holy Basil)',
    description: 'Sacred plant with medicinal properties. Known for its antibacterial and anti-inflammatory benefits. Essential for every Indian home.',
    price: 99, originalPrice: 149,
    image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&q=80',
    category: 'Medicinal Plants', stock: 30,
    sunlight: 'Full Sun', watering: 'Daily', soil: 'Fertile, well-drained',
    difficulty: 'Easy', petFriendly: true, rating: 4.8, numReviews: 35, season: ['Summer', 'Monsoon'],
  },
  {
    name: 'Areca Palm',
    description: 'An elegant and air-purifying indoor palm that adds a tropical feel to any space. NASA-approved air purifier.',
    price: 499, originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    category: 'Air Purifying Plants', stock: 20,
    sunlight: 'Bright Indirect', watering: 'Twice per week', soil: 'Well drained mix',
    difficulty: 'Medium', petFriendly: true, rating: 4.3, numReviews: 15, season: ['All'],
  },
  {
    name: 'Snake Plant',
    description: 'One of the hardiest and most air-purifying plants. Perfect for beginners. Tolerates low light and irregular watering.',
    price: 249, originalPrice: 349,
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=600&q=80',
    category: 'Air Purifying Plants', stock: 40,
    sunlight: 'Low to Medium', watering: 'Once every 2 weeks', soil: 'Sandy, well-drained',
    difficulty: 'Easy', petFriendly: false, rating: 4.7, numReviews: 45, season: ['All'],
  },
  {
    name: 'Peace Lily',
    description: 'Beautiful flowering plant that blooms even in low light. Excellent air purifier and very easy to maintain indoors.',
    price: 349, originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=600&q=80',
    category: 'Flowering Plants', stock: 25,
    sunlight: 'Low to Medium', watering: 'Twice per week', soil: 'Rich, moist mix',
    difficulty: 'Easy', petFriendly: false, rating: 4.4, numReviews: 18, season: ['All'],
  },
  {
    name: 'Aloe Vera',
    description: 'A must-have succulent with medicinal gel used for skin care, burns and digestion. Very low maintenance plant.',
    price: 129, originalPrice: 179,
    image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&q=80',
    category: 'Succulents', stock: 60,
    sunlight: 'Full to Partial Sun', watering: 'Once per week', soil: 'Sandy, cactus mix',
    difficulty: 'Easy', petFriendly: false, rating: 4.9, numReviews: 60, season: ['All'],
  },
  {
    name: 'Hibiscus',
    description: 'Vibrant flowering outdoor plant. The flowers are used for making herbal tea and hair care products.',
    price: 199, originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80',
    category: 'Outdoor Plants', stock: 35,
    sunlight: 'Full Sun', watering: 'Daily in summer', soil: 'Rich, well-drained',
    difficulty: 'Medium', petFriendly: true, rating: 4.2, numReviews: 22, season: ['Summer', 'Monsoon'],
  },
  {
    name: 'Jade Plant',
    description: 'A long-living succulent that looks like a mini tree. Very easy to care for and believed to bring good luck.',
    price: 199, originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=600&q=80',
    category: 'Succulents', stock: 30,
    sunlight: 'Full Sun', watering: 'Once every 2 weeks', soil: 'Sandy cactus mix',
    difficulty: 'Easy', petFriendly: false, rating: 4.4, numReviews: 12, season: ['All'],
  },
  {
    name: 'Rubber Plant',
    description: 'A stunning indoor plant with large glossy leaves. Great air purifier and very low maintenance for any room.',
    price: 399, originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1616412540329-25c64a53a2c3?w=600&q=80',
    category: 'Indoor Plants', stock: 18,
    sunlight: 'Bright Indirect', watering: 'Once per week', soil: 'Well drained potting mix',
    difficulty: 'Easy', petFriendly: false, rating: 4.6, numReviews: 28, season: ['All'],
  },
  {
    name: 'Mint',
    description: 'A fast-growing aromatic herb perfect for kitchen gardens. Great for cooking, making tea and medicinal uses.',
    price: 79, originalPrice: 99,
    image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600&q=80',
    category: 'Medicinal Plants', stock: 50,
    sunlight: 'Partial Sun', watering: 'Daily', soil: 'Moist, fertile',
    difficulty: 'Easy', petFriendly: true, rating: 4.7, numReviews: 40, season: ['All'],
  },
  {
    name: 'Bougainvillea',
    description: 'A stunning climbing plant with vibrant pink and purple bracts. Perfect for gates, walls and fences.',
    price: 249, originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1596373019580-e5f7a6695d72?w=600&q=80',
    category: 'Outdoor Plants', stock: 22,
    sunlight: 'Full Sun', watering: 'Twice per week', soil: 'Well drained',
    difficulty: 'Medium', petFriendly: true, rating: 4.5, numReviews: 17, season: ['Summer', 'Winter'],
  },
  {
    name: 'Pothos',
    description: 'One of the easiest plants to grow. Trails beautifully from shelves and purifies indoor air effectively.',
    price: 119, originalPrice: 159,
    image: 'https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=600&q=80',
    category: 'Indoor Plants', stock: 45,
    sunlight: 'Low to Medium', watering: 'Once per week', soil: 'Well drained potting mix',
    difficulty: 'Easy', petFriendly: false, rating: 4.6, numReviews: 33, season: ['All'],
  },
  {
    name: 'Cactus',
    description: 'Virtually indestructible desert plant. Perfect for busy people who forget to water. Available in many shapes.',
    price: 89, originalPrice: 119,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&q=80',
    category: 'Succulents', stock: 55,
    sunlight: 'Full Sun', watering: 'Once every 3 weeks', soil: 'Sandy cactus mix',
    difficulty: 'Easy', petFriendly: false, rating: 4.3, numReviews: 25, season: ['All'],
  },
  {
    name: 'Lavender',
    description: 'Beautiful purple flowering plant with a calming fragrance. Great for gardens and windowsills.',
    price: 179, originalPrice: 229,
    image: 'https://images.unsplash.com/photo-1499540813035-1fdebf1acda0?w=600&q=80',
    category: 'Flowering Plants', stock: 28,
    sunlight: 'Full Sun', watering: 'Twice per week', soil: 'Well drained sandy soil',
    difficulty: 'Medium', petFriendly: true, rating: 4.5, numReviews: 19, season: ['Winter', 'Summer'],
  },
  {
    name: 'Bamboo Plant',
    description: 'Lucky bamboo is believed to bring good fortune. Grows in water or soil, perfect for desks and shelves.',
    price: 299, originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1602923668104-8f9e03e77e62?w=600&q=80',
    category: 'Indoor Plants', stock: 32,
    sunlight: 'Low to Medium', watering: 'Change water weekly', soil: 'Can grow in water',
    difficulty: 'Easy', petFriendly: true, rating: 4.4, numReviews: 22, season: ['All'],
  },
  {
    name: 'Neem Tree',
    description: 'A versatile medicinal tree with amazing antibacterial and antifungal properties. Natural pest repellent.',
    price: 299, originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80',
    category: 'Medicinal Plants', stock: 15,
    sunlight: 'Full Sun', watering: 'Twice per week', soil: 'Sandy loam',
    difficulty: 'Easy', petFriendly: false, rating: 4.6, numReviews: 25, season: ['Summer', 'Monsoon'],
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await Product.deleteMany();
    await Product.insertMany(plants);
    console.log(`✅ Seeded ${plants.length} plants with Unsplash images`);
    process.exit(0);
  })
  .catch(err => { console.error('Seed error:', err.message); process.exit(1); });
