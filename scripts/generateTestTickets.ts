import { collection, addDoc, Timestamp } from "firebase/firestore";
import { firestore } from "../src/config/firebase";

const departments = ["IT", "HR", "Finance", "Operations", "Marketing"];
const statuses = ["pending", "in-progress", "completed", "urgent"];
const priorities = ["Low", "Medium", "High"];

const generateTestTickets = async (count: number = 150) => {
  console.log(`Generating ${count} test tickets...`);

  const ticketsCollection = collection(firestore, "tickets");
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < count; i++) {
    try {
      const randomDept = departments[Math.floor(Math.random() * departments.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
      const daysAgo = Math.floor(Math.random() * 30);

      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const ticketData = {
        title: `Test Ticket ${i + 1} - ${randomDept} Issue`,
        description: `This is a test ticket for performance testing. Ticket #${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        status: randomStatus,
        priority: randomPriority,
        department: randomDept,
        createdAt: Timestamp.fromDate(createdAt),
        updatedAt: Timestamp.now(),
        submittedBy: `customer${Math.floor(Math.random() * 10)}@example.com`,
        assignedTo: randomStatus === "pending" ? null : `staff${Math.floor(Math.random() * 5)}@example.com`,
        ticketNumber: `25${String(createdAt.getMonth() + 1).padStart(2, "0")}${String(createdAt.getDate()).padStart(2, "0")}${String(i + 1).padStart(4, "0")}`,
      };

      await addDoc(ticketsCollection, ticketData);
      successCount++;

      if ((i + 1) % 25 === 0) {
        console.log(`Created ${i + 1}/${count} tickets...`);
      }
    } catch (error) {
      console.error(`Error creating ticket ${i + 1}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✅ Test data generation complete!`);
  console.log(`✓ Successfully created: ${successCount} tickets`);
  console.log(`✗ Failed: ${errorCount} tickets`);
};

// Run the script
generateTestTickets(150).catch(console.error);

