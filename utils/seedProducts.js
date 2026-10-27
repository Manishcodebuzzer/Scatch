const productModel = require("../models/product-model");
const { createBagSvg } = require("./bagImages");

async function seedProductsIfNeeded() {
  try {
    const count = await productModel.countDocuments();
    if (count >= 4) {
      return; // Already populated
    }

    const sampleProducts = [
      {
        name: "Aura Italian Leather Tote",
        category: "Tote Bags",
        price: 4999,
        discount: 500,
        bgcolor: "#f8f9fa",
        panelcolor: "#18181b",
        panecolor: "#18181b",
        textcolor: "#f4f4f5",
        stock: 18,
        rating: 4.9,
        isFeatured: true,
        isNewArrival: true,
        description:
          "Handcrafted from full-grain Tuscan calfskin leather with polished brass hardware. Features a dual-compartment interior, magnetic clasp, and protective base feet.",
        reviews: [
          {
            name: "Ananya Sharma",
            rating: 5,
            comment: "The leather aroma and stitching quality are absolute perfection.",
          },
          {
            name: "Vikram Mehta",
            rating: 5,
            comment: "Spacious enough for a 15-inch laptop yet looks incredibly sleek.",
          },
        ],
        image: createBagSvg("tote", "#1e293b", "#d97706"),
      },
      {
        name: "Nocturne Ballistic Backpack",
        category: "Backpacks",
        price: 6499,
        discount: 1200,
        bgcolor: "#e2e8f0",
        panelcolor: "#0f172a",
        panecolor: "#0f172a",
        textcolor: "#38bdf8",
        stock: 12,
        rating: 4.8,
        isFeatured: true,
        isNewArrival: true,
        description:
          "Engineered with water-repellent ballistic nylon and memory-foam airmesh straps. Includes a TSA-compliant 16-inch laptop chamber and anti-theft pocket.",
        reviews: [
          {
            name: "Rohan Kapoor",
            rating: 5,
            comment: "Took this across three countries. Rainproof and exceptionally comfortable.",
          },
        ],
        image: createBagSvg("backpack", "#0f172a", "#38bdf8"),
      },
      {
        name: "Vanguard Heritage Crossbody",
        category: "Crossbody",
        price: 3799,
        discount: 400,
        bgcolor: "#fef3c7",
        panelcolor: "#78350f",
        panecolor: "#78350f",
        textcolor: "#fef08a",
        stock: 25,
        rating: 4.7,
        isFeatured: false,
        isNewArrival: true,
        description:
          "A refined everyday statement piece. Features smooth saddle leather, solid brass accents, adjustable shoulder strap, and internal organizing slots.",
        reviews: [
          {
            name: "Sneha Patel",
            rating: 4,
            comment: "Elegant color and just the right size for essentials.",
          },
        ],
        image: createBagSvg("crossbody", "#78350f", "#f59e0b"),
      },
      {
        name: "Monolith 48H Travel Duffle",
        category: "Travel Duffles",
        price: 8999,
        discount: 1500,
        bgcolor: "#e0e7ff",
        panelcolor: "#1e1b4b",
        panecolor: "#1e1b4b",
        textcolor: "#a5b4fc",
        stock: 9,
        rating: 5.0,
        isFeatured: true,
        isNewArrival: false,
        description:
          "The quintessential luxury weekender. Wax-treated canvas reinforced with bridle leather straps, heavy-duty YKK Excella zippers, and ventilated shoe compartment.",
        reviews: [
          {
            name: "Devendra Singhania",
            rating: 5,
            comment: "Supreme luxury build. Received endless compliments at airport lounge.",
          },
        ],
        image: createBagSvg("duffle", "#1e1b4b", "#6366f1"),
      },
      {
        name: "Sovereign Executive Briefcase",
        category: "Briefcases",
        price: 11499,
        discount: 2000,
        bgcolor: "#ecfdf5",
        panelcolor: "#064e3b",
        panecolor: "#064e3b",
        textcolor: "#6ee7b7",
        stock: 7,
        rating: 4.9,
        isFeatured: true,
        isNewArrival: false,
        description:
          "Mastercrafted for top executives and boardroom presentations. Dual combination brass locks, velvety suede lining, and dedicated folio compartments.",
        reviews: [
          {
            name: "Karan Johar",
            rating: 5,
            comment: "Distinguished look and outstanding craftsmanship.",
          },
        ],
        image: createBagSvg("briefcase", "#064e3b", "#10b981"),
      },
      {
        name: "Velvet Riviera Monogram Clutch",
        category: "Clutches",
        price: 2999,
        discount: 300,
        bgcolor: "#fce7f3",
        panelcolor: "#831843",
        panecolor: "#831843",
        textcolor: "#fbcfe8",
        stock: 14,
        rating: 4.8,
        isFeatured: false,
        isNewArrival: true,
        description:
          "Plush deep velvet exterior crowned with 24K gold-plated clasp. Effortlessly converts from hand clutch to shoulder cross with detachable link chain.",
        reviews: [
          {
            name: "Pooja Hegde",
            rating: 5,
            comment: "Looks like a 20k designer bag. Beautiful finish!",
          },
        ],
        image: createBagSvg("clutch", "#831843", "#ec4899"),
      },
    ];

    await productModel.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} premium products into Scatch database.`);
  } catch (err) {
    console.error("Error seeding products:", err.message);
  }
}

async function ensureAdminExists() {
  try {
    const ownerModel = require("../models/owners-model");
    const userModel = require("../models/user-model");
    const bcrypt = require("bcrypt");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("12345", salt);

    let owner = await ownerModel.findOne({ email: "manish@gmail.com" });
    if (!owner) {
      await ownerModel.create({
        fullname: "Manish Singh",
        email: "manish@gmail.com",
        password: hash,
        gstin: "27AAACR1234A1Z5",
      });
      console.log("Initialized owner account for manish@gmail.com");
    } else {
      owner.password = hash;
      await owner.save();
    }

    let user = await userModel.findOne({ email: "manish@gmail.com" });
    if (user) {
      user.password = hash;
      user.role = "admin";
      await user.save();
    }
  } catch (err) {
    console.error("Error ensuring admin account:", err.message);
  }
}

module.exports = { seedProductsIfNeeded, ensureAdminExists };

