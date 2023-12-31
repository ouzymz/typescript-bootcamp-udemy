import * as dotenv from "dotenv"; //bunu diger importlardan once cagirmamiz gerekiyor.

const result = dotenv.config();

import "reflect-metadata";

import { COURSES, USERS } from "./db-data";
import { AppDataSource } from "../data-source";
import { DeepPartial } from "typeorm";
import { Course } from "./course";
import { Lesson } from "./lesson";
import { User } from "./user";
import { calculatePasswordHash } from "../utils";

async function populateDb() {
  await AppDataSource.initialize();

  const users = Object.values(USERS) as any[];

  for (let userData of users) {
    console.log(`Inserting course ${userData}`);

    const { email, pictureUrl, isAdmin, passwordSalt, plainTextPassword } =
      userData;

    const user = AppDataSource.getRepository(User).create({
      email,
      pictureUrl,
      isAdmin,
      passwordSalt,
      passwordHash: await calculatePasswordHash(plainTextPassword, passwordSalt),
    });

    await AppDataSource.getRepository(User).save(user);
    // await AppDataSource.manager.save(user);
  }

  console.log(`Database connection ready.`);

  const courses = Object.values(COURSES) as DeepPartial<Course>[];

  const courseReporsitory = AppDataSource.getRepository(Course);
  const lessonReporsitory = AppDataSource.getRepository(Lesson);

  for (let courseData of courses) {
    console.log(`Inserting course ${courseData.title}`);
    const course = courseReporsitory.create(courseData);
    await courseReporsitory.save(course);
    for (let lessonData of course.lessons) {
      console.log(`Inserting lesson ${lessonData.title}`);
      const lesson = lessonReporsitory.create(lessonData);
      lesson.course = course;
      await lessonReporsitory.save(lesson);
    }
  }

 

  const totalCourses = await courseReporsitory.createQueryBuilder().getCount();
  const totalLessons = await lessonReporsitory.createQueryBuilder().getCount();

  console.log(
    `Data Inserted - courses ${totalCourses}, lessons ${totalLessons}`
  );
}

populateDb()
  .then(() => {
    console.log("finisher populating databas, existing!");
    process.exit();
  })
  .catch((err) => {
    console.error(`Error populating databse.`, err);
  });
