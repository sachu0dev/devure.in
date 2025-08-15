require("dotenv").config();
const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Service Schema (simplified for seeding)
const serviceSchema = new mongoose.Schema(
  {
    serviceType: String,
    title: String,
    slug: String,
    image: String,
    content: String,
    excerpt: String,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

// Services Header Schema
const servicesHeaderSchema = new mongoose.Schema(
  {
    mainTitle: String,
    services: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ServicesHeader = mongoose.model("ServicesHeader", servicesHeaderSchema);

// Sample data from ImageSlider component
const sampleServices = [
  {
    serviceType: "Web Development",
    title: "Modern, scalable web apps for your business.",
    slug: "modern-scalable-web-apps",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    content: `
# Modern, Scalable Web Apps for Your Business

We build cutting-edge web applications that scale with your business needs. Our expertise includes:

## Frontend Technologies
- React.js with TypeScript
- Next.js for server-side rendering
- Modern CSS frameworks and animations
- Responsive design for all devices

## Backend Solutions
- Node.js and Express
- Python with Django/Flask
- Database design and optimization
- API development and integration

## Key Features
- **Performance**: Optimized for speed and user experience
- **Scalability**: Built to handle growth and increased traffic
- **Security**: Enterprise-grade security measures
- **Maintenance**: Easy to maintain and update

Contact us to discuss your web application needs!
    `,
    excerpt:
      "Build cutting-edge web applications that scale with your business needs using modern technologies.",
    isActive: true,
    isFeatured: true,
    order: 1,
    metaTitle: "Modern Web Development Services - Devure",
    metaDescription:
      "Professional web development services for modern, scalable business applications.",
  },
  {
    serviceType: "SaaS Platforms",
    title: "Launch your SaaS idea with robust infrastructure.",
    slug: "saas-platforms-robust-infrastructure",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    content: `
# SaaS Platform Development

Transform your SaaS idea into a robust, scalable platform that users love.

## What We Build
- **User Management Systems**: Authentication, authorization, user roles
- **Subscription Management**: Billing, plans, upgrades/downgrades
- **Multi-tenancy**: Isolated environments for different customers
- **Analytics Dashboard**: User insights and business metrics
- **API Infrastructure**: RESTful APIs and webhook systems

## Technology Stack
- **Frontend**: React, Vue.js, or Angular
- **Backend**: Node.js, Python, or Java
- **Database**: PostgreSQL, MongoDB, or MySQL
- **Cloud**: AWS, Azure, or Google Cloud
- **DevOps**: CI/CD, monitoring, and scaling

## Success Stories
Our SaaS platforms have helped businesses:
- Reduce time to market by 60%
- Scale from 100 to 100,000+ users
- Achieve 99.9% uptime
- Generate millions in recurring revenue

Ready to build your SaaS empire? Let's talk!
    `,
    excerpt:
      "Transform your SaaS idea into a robust, scalable platform with enterprise-grade infrastructure.",
    isActive: true,
    isFeatured: true,
    order: 2,
    metaTitle: "SaaS Platform Development - Devure",
    metaDescription:
      "Build robust SaaS platforms with scalable infrastructure and enterprise features.",
  },
  {
    serviceType: "Productivity Tools",
    title: "Boost productivity with custom solutions.",
    slug: "productivity-tools-custom-solutions",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    content: `
# Custom Productivity Tools

Boost your team's efficiency with tailor-made productivity solutions.

## Tool Categories
- **Project Management**: Task tracking, team collaboration, progress monitoring
- **Time Management**: Time tracking, scheduling, deadline management
- **Communication**: Team chat, video conferencing, file sharing
- **Automation**: Workflow automation, repetitive task elimination
- **Reporting**: Data visualization, KPI tracking, insights generation

## Custom Features
- **Integration**: Connect with your existing tools and systems
- **Workflow**: Design processes that match your team's needs
- **Analytics**: Track usage and identify improvement opportunities
- **Mobile**: Access tools anywhere, anytime
- **Security**: Enterprise-grade security and compliance

## Benefits
- **Increased Efficiency**: Streamline workflows and eliminate bottlenecks
- **Better Collaboration**: Improve team communication and coordination
- **Data Insights**: Make informed decisions with real-time analytics
- **Cost Savings**: Reduce manual work and improve resource utilization

Let's build tools that work the way your team works!
    `,
    excerpt:
      "Custom productivity tools designed to streamline workflows and boost team efficiency.",
    isActive: true,
    isFeatured: false,
    order: 3,
    metaTitle: "Custom Productivity Tools - Devure",
    metaDescription:
      "Boost team productivity with custom tools designed for your specific workflows.",
  },
  {
    serviceType: "Analytics",
    title: "Gain insights with real-time analytics dashboards.",
    slug: "real-time-analytics-dashboards",
    image: "https://wallpapercave.com/wp/wp9684460.jpg",
    content: `
# Real-Time Analytics Dashboards

Transform your data into actionable insights with powerful analytics solutions.

## Dashboard Features
- **Real-Time Data**: Live updates and instant insights
- **Interactive Visualizations**: Charts, graphs, and interactive elements
- **Custom Metrics**: Track KPIs that matter to your business
- **Drill-Down Capability**: Explore data at multiple levels
- **Alert System**: Get notified of important changes or trends

## Data Sources
- **Databases**: SQL, NoSQL, and data warehouses
- **APIs**: Third-party services and internal systems
- **Files**: CSV, Excel, JSON, and other formats
- **Streaming**: Real-time data feeds and IoT devices
- **Web Analytics**: User behavior and website performance

## Use Cases
- **Business Intelligence**: Sales, marketing, and operational insights
- **User Analytics**: Customer behavior and engagement metrics
- **Performance Monitoring**: System health and application metrics
- **Financial Reporting**: Revenue, costs, and profitability analysis
- **Market Research**: Industry trends and competitive analysis

## Technology
- **Frontend**: React, D3.js, Chart.js
- **Backend**: Python, Node.js, or Java
- **Databases**: ClickHouse, InfluxDB, or TimescaleDB
- **Streaming**: Apache Kafka, Redis, or RabbitMQ
- **Cloud**: AWS, Azure, or Google Cloud

Turn your data into your competitive advantage!
    `,
    excerpt:
      "Powerful analytics dashboards that provide real-time insights and actionable business intelligence.",
    isActive: true,
    isFeatured: false,
    order: 4,
    metaTitle: "Real-Time Analytics Dashboards - Devure",
    metaDescription:
      "Transform data into insights with real-time analytics dashboards and business intelligence tools.",
  },
  {
    serviceType: "Social Platforms",
    title: "Connect communities with engaging social apps.",
    slug: "social-platforms-community-apps",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1200&auto=format&fit=crop",
    content: `
# Social Platform Development

Build engaging social platforms that bring communities together.

## Platform Types
- **Social Networks**: Connect people with shared interests
- **Community Forums**: Discussion boards and knowledge sharing
- **Content Platforms**: User-generated content and media sharing
- **Professional Networks**: Business connections and career development
- **Dating Apps**: Relationship building and matching algorithms

## Core Features
- **User Profiles**: Rich profiles with customization options
- **Content Sharing**: Posts, images, videos, and documents
- **Interaction Tools**: Likes, comments, shares, and reactions
- **Messaging**: Direct messages and group chats
- **Notifications**: Real-time updates and engagement alerts
- **Moderation**: Content filtering and community guidelines

## Technical Requirements
- **Scalability**: Handle millions of users and interactions
- **Performance**: Fast loading and smooth user experience
- **Security**: Protect user data and prevent abuse
- **Mobile-First**: Responsive design for all devices
- **Real-Time**: Live updates and instant communication

## Success Metrics
- **User Engagement**: Daily active users and session duration
- **Content Creation**: Posts, comments, and media uploads
- **Community Growth**: User acquisition and retention rates
- **Network Effects**: Value increase with user growth

Build the next big social platform!
    `,
    excerpt:
      "Engaging social platforms that connect communities and foster meaningful interactions.",
    isActive: true,
    isFeatured: false,
    order: 5,
    metaTitle: "Social Platform Development - Devure",
    metaDescription:
      "Build engaging social platforms that connect communities and drive user engagement.",
  },
];

// Services Header data
const servicesHeaderData = {
  mainTitle: "Creating impact in",
  services: [
    "CRM",
    "Chat Apps",
    "E-commerce",
    "SaaS",
    "Portfolio",
    "Analytics",
    "Social Network",
    "API Platform",
    "Blog/CMS",
    "Marketplace",
  ],
  isActive: true,
};

// Seed function
const seedServices = async () => {
  try {
    console.log("🌱 Starting services seeding...");

    // Clear existing data
    await Service.deleteMany({});
    await ServicesHeader.deleteMany({});
    console.log("🧹 Cleared existing services and header data");

    // Insert services header
    const header = new ServicesHeader(servicesHeaderData);
    await header.save();
    console.log("✅ Services header created");

    // Insert services
    for (const serviceData of sampleServices) {
      const service = new Service(serviceData);
      await service.save();
      console.log(`✅ Service created: ${serviceData.title}`);
    }

    console.log(
      `🎉 Successfully seeded ${sampleServices.length} services and header!`
    );

    // Display summary
    const totalServices = await Service.countDocuments();
    const headerData = await ServicesHeader.findOne({ isActive: true });

    console.log("\n📊 Seeding Summary:");
    console.log(`- Services: ${totalServices}`);
    console.log(`- Header Title: ${headerData.mainTitle}`);
    console.log(`- Rotating Services: ${headerData.services.length} items`);
  } catch (error) {
    console.error("❌ Error seeding services:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run the seeding
connectDB().then(() => {
  seedServices();
});
