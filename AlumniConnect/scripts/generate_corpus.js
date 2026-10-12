import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const names = [
  "Rahul Sharma", "Priya Patel", "Ananya Iyer", "Vikram Malhotra", "Rohan Verma",
  "Sneha Kulkarni", "Aditya Nair", "Tanvi Deshmukh", "Karthik Swaminathan", "Meera Sen",
  "Arjun Singhania", "Divya Menon", "Siddharth Joshi", "Pooja Reddy", "Abhishek Bose",
  "Neha Chawla", "Varun Mehta", "Ritu Das", "Sanjay Nambiar", "Kavita Rao",
  "Manish Gupta", "Shreya Saxena", "Naveen Choudhury", "Pooja Hegde", "Gaurav Bhattacharya",
  "Swati Mishra", "Harish Pillai", "Aparna Sundaram", "Akash Ganguly", "Nandini Mukherjee",
  "Kunal Kapoor", "Deepika Shenoy", "Vishal Agrawal", "Monika Banerjee", "Tarun Mathur",
  "Pallavi Varma", "Suresh Pillai", "Anjali Kaul", "Rajeshwari S", "Pranav Anand",
  "Sunita Chauhan", "Amit Trivedi", "Isha Goswami", "Bhavin Shah", "Roshni Pillai",
  "Chetan Patil", "Simran Kaur", "Dinesh Karthik", "Preeti Shenoy", "Rishi Alapati",
  "Archana Venkatesh", "Sameer Qureshi", "Sangeeta Mahajan", "Kishore Kumar", "Vandana Rao",
  "Saurabh Jain", "Aishwarya Rai", "Lokesh Rahul", "Geeta Phogat", "Hemant Karkare",
  "Maya Angelou", "Devendra Fadnavis", "Shobha De", "Gopal Krishna", "Yamini Krishnamurthy",
  "Raghuram Rajan", "Aravind Adiga", "Jhumpa Lahiri", "Salman Rushdie", "Arundhati Roy",
  "Amartya Sen", "Vikram Seth", "Kiran Desai", "Rohinton Mistry", "Anita Desai",
  "Ruskin Bond", "Khushwant Singh", "R.K. Narayan", "Mulk Raj Anand", "Sarojini Naidu",
  "Jayant Narlikar", "Homi Bhabha", "Satish Dhawan", "Vikram Sarabhai", "A.P.J. Abdul Kalam",
  "C.V. Raman", "Satyendra Nath Bose", "Meghnad Saha", "Subrahmanyan Chandrasekhar", "Har Gobind Khorana",
  "Venkatraman Ramakrishnan", "Sundar Pichai", "Satya Nadella", "Shantanu Narayen", "Arvind Krishna",
  "Nikesh Arora", "Rajeev Suri", "Vinod Khosla", "Sabeer Bhatia", "Nandan Nilekani"
];

const departments = [
  "Computer Science and Engineering",
  "Information Technology",
  "Data Science and Artificial Intelligence",
  "Software Engineering",
  "Electrical and Electronics Engineering",
  "Electronics and Communication Engineering",
  "Computational Mathematics"
];

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple",
  "Adobe", "Netflix", "Salesforce", "Oracle", "Cisco",
  "Stripe", "Uber", "LinkedIn", "Twitter/X", "Spotify",
  "TCS Research", "Infosys Labs", "Wipro Digital", "Cognizant AI", "Accenture Solutions"
];

const roles = [
  "Software Development Engineer",
  "Full Stack Developer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Backend Systems Engineer",
  "Frontend Web Architect",
  "Cloud Infrastructure Engineer",
  "DevOps & Reliability Engineer",
  "Distributed Systems Developer",
  "Database Administrator and Architect"
];

const skillPools = [
  ["Java", "Spring Boot", "Microservices", "REST APIs", "SQL", "Hibernate", "Docker", "Git"],
  ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Data Science", "Pandas", "Scikit-Learn"],
  ["React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "Web Development", "Node.js"],
  ["Java", "Python", "Data Structures", "Algorithms", "Object-Oriented Programming", "SQL", "Git"],
  ["Go", "Kubernetes", "Docker", "Cloud Architecture", "AWS", "Distributed Systems", "Linux"],
  ["C++", "Competitive Programming", "High Performance Computing", "Operating Systems", "Computer Networks"],
  ["Python", "SQL", "Big Data", "Apache Spark", "Data Analytics", "PowerBI", "Machine Learning"],
  ["Java", "Web Development", "Angular", "Express", "MongoDB", "CI/CD Pipelines", "Agile"],
  ["Python", "Deep Learning", "Natural Language Processing", "Computer Vision", "Transformers", "Keras"],
  ["React", "Node.js", "Full Stack Development", "PostgreSQL", "Redis", "GraphQL", "REST APIs"]
];

const projectDescriptions = [
  (skills) => `Designed and deployed an enterprise distributed transaction engine using ${skills[0]} and ${skills[1]}. Scaled to handle 50,000 requests per minute with strict fault tolerance.`,
  (skills) => `Implemented an automated resume parser leveraging ${skills[0]} and ${skills[1]} to categorize candidate technical skills and rank applicant qualifications.`,
  (skills) => `Architected a high-concurrency microservices system using ${skills[0]} and containerized the microservices with Docker and Kubernetes for high availability.`,
  (skills) => `Built a predictive recommendation engine in ${skills[0]} utilizing advanced ${skills[1]} models to enhance user engagement metrics by 34%.`,
  (skills) => `Developed an end-to-end web portal for university alumni networking using ${skills[0]} and ${skills[1]} featuring real-time pattern search and messaging.`,
  (skills) => `Researched pattern matching algorithms including Knuth-Morris-Pratt (KMP) and Boyer-Moore for high-throughput genomic data stream indexing.`,
  (skills) => `Created a real-time data streaming pipeline using Apache Kafka, ${skills[0]}, and ${skills[1]} to analyze IoT sensor telemetry logs.`,
  (skills) => `Constructed a secure role-based access control authentication microservice in ${skills[0]} with OAuth2 and JWT token verification.`,
  (skills) => `Engineered an automated performance profiling suite in ${skills[0]} that optimized memory allocation in large-scale server applications.`,
  (skills) => `Trained custom transformer architectures in ${skills[0]} for domain-specific technical corpus summarization and query classification.`
];

const experienceDescriptions = [
  (skills, comp, role) => `Serves as ${role} at ${comp}. Core responsibilities include writing robust ${skills[0]} backend services, maintaining database reliability, and collaborating on sprint deliverables.`,
  (skills, comp, role) => `Currently working at ${comp} focusing on ${skills[0]} and ${skills[1]}. Spearheaded the migration of legacy monolithic modules to modern cloud-native architectures.`,
  (skills, comp, role) => `Extensive hands-on background in ${skills[0]} development and software engineering. Authored production test suites and mentored junior developers in test-driven development.`,
  (skills, comp, role) => `Led an agile squad at ${comp} delivering scalable ${skills[1]} pipelines. Championed automated CI/CD practices and architectural design reviews across the engineering unit.`,
  (skills, comp, role) => `Specializes in algorithms, data structures, and ${skills[0]} programming. Conducted technical interviews and contributed to open-source developer tooling.`
];

for (let i = 1; i <= 100; i++) {
  const padId = String(i).padStart(3, '0');
  const filename = `alumni${padId}.txt`;
  const name = names[i - 1] || `Alumni Member ${i}`;
  const dept = departments[(i * 3 + 1) % departments.length];
  const year = 2017 + (i % 8); // 2017 - 2024
  const role = roles[(i * 7) % roles.length];
  const company = companies[(i * 5) % companies.length];
  const skills = skillPools[i % skillPools.length];
  const proj1 = projectDescriptions[(i + 2) % projectDescriptions.length](skills);
  const proj2 = projectDescriptions[(i + 5) % projectDescriptions.length](skills);
  const exp = experienceDescriptions[i % experienceDescriptions.length](skills, company, role);

  const content = 
`Alumni ID: A${padId}
Name: ${name}
Department: ${dept}
Graduation Year: ${year}
Current Role: ${role}
Company: ${company}

Skills:
${skills.join(', ')}.

Projects:
${proj1}
${proj2}

Experience:
${exp}
`;

  fs.writeFileSync(path.join(dataDir, filename), content, 'utf8');
}

console.log('Successfully generated 100 alumni documents in data/');
