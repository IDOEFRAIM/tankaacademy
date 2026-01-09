
import "dotenv/config";
import { db } from "../lib/db";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

async function main() {
  console.log("Seeding external courses...");

  const userEmail = "efra@gmail.com";
  let user = await db.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    console.log(`User ${userEmail} not found. Creating...`);
    user = await db.user.create({
      data: {
        email: userEmail,
        name: "Professor Efra",
        role: "INSTRUCTOR",
      }
    });
  }

  const categoryName = "Python Development";
  let category = await db.category.findFirst({
    where: { name: categoryName },
  });

  if (!category) {
    category = await db.category.create({
      data: { name: categoryName },
    });
    console.log(`Created category: ${categoryName}`);
  }

  const coursesData = [
    {
      title: "Python - Niveau 1 : Les Bases",
      description: "Apprenez les fondamentaux de Python : syntaxe, variables, boucles et fonctions. Idéal pour commencer.",
      folder: "python/basic",
      chapters: [
        { title: "Introduction Python & Installation", position: 1, fileName: "01_introduction_python.ipynb" },
        { title: "Bases & Syntaxe", position: 2, fileName: "02_bases_syntaxe.ipynb" },
        { title: "Opérateurs & Conditions", position: 3, fileName: "03_operateurs_conditions.ipynb" },
        { title: "Boucles (For, While)", position: 4, fileName: "04_boucles.ipynb" },
        { title: "Listes & Tuples", position: 5, fileName: "05_listes_tuples.ipynb" },
        { title: "Dictionnaires", position: 6, fileName: "06_dictionnaires.ipynb" },
        { title: "Fonctions", position: 7, fileName: "07_fonctions.ipynb" },
        { title: "Modules & Gestion des Erreurs", position: 8, fileName: "08_modules_erreurs.ipynb" },
      ]
    },
    {
      title: "Python - Niveau 2 : Intermédiaire",
      description: "Approfondissez vos connaissances avec la POO, la gestion de fichiers et les structures avancées.",
      folder: "python/intermediate",
      chapters: [
        { title: "Gestion de Fichiers", position: 1, fileName: "01_gestion_fichiers.ipynb" },
        { title: "Compréhensions de Listes", position: 2, fileName: "02_comprehensions_listes.ipynb" },
        { title: "POO - Classes et Objets", position: 3, fileName: "03_poo_classes.ipynb" },
        { title: "POO - Héritage et Polymorphisme", position: 4, fileName: "04_poo_heritage.ipynb" },
        { title: "Fonctions Avancées (Lambda, Decorateurs)", position: 5, fileName: "05_fonctions_avancees.ipynb" },
        { title: "Décorateurs", position: 6, fileName: "06_decorateurs.ipynb" },
        { title: "Itérateurs & Générateurs", position: 7, fileName: "07_iterateurs_generateurs.ipynb" },
        { title: "Sérialisation (JSON, CSV)", position: 8, fileName: "08_serialisation_json_csv.ipynb" },
        { title: "Dates & Heures", position: 9, fileName: "09_dates_heures.ipynb" },
        { title: "Récursivité", position: 10, fileName: "10_recursivite.ipynb" },
      ]
    },
    {
      title: "Python - Niveau 3 : Avancé",
      description: "Devenez un expert Python : API, Bases de données, Tests unitaires et Programmation asynchrone.",
      folder: "python/advance",
      chapters: [
        { title: "Requêtes API", position: 1, fileName: "01_requetes_api.ipynb" },
        { title: "Expressions Régulières (Regex)", position: 2, fileName: "02_regex.ipynb" },
        { title: "Bases de Données (SQLite)", position: 3, fileName: "03_bases_de_donnees_sqlite.ipynb" },
        { title: "Intro Data Science (Pandas)", position: 4, fileName: "04_intro_datascience_pandas.ipynb" },
        { title: "Tests Unitaires", position: 5, fileName: "05_tests_unitaires.ipynb" },
        { title: "Programmation Asynchrone", position: 6, fileName: "06_asynchrone.ipynb" },
        { title: "Gestionnaires de Contexte & Typage", position: 7, fileName: "07_gestionnaires_contexte_et_typage.ipynb" },
      ]
    },
    {
      title: "Python - Data Science : Pandas",
      description: "Maîtrisez la manipulation et l'analyse de données avec la librairie Pandas.",
      folder: "python/pandas/cours",
      chapters: [
        { title: "Bases et Lecture", position: 1, fileName: "01_bases_et_lecture.ipynb" },
        { title: "Manipulation & Filtrage", position: 2, fileName: "02_manipulation_filtrage.ipynb" },
        { title: "GroupBy & Analyse", position: 3, fileName: "03_groupby_analyse.ipynb" },
        { title: "Fusion & Temporel", position: 4, fileName: "04_fusion_temporel.ipynb" },
      ]
    },
    {
      title: "Python - Data Science : NumPy",
      description: "Calcul scientifique et manipulation de tableaux multidimensionnels avec NumPy.",
      folder: "python/numpy/cours",
      chapters: [
        { title: "Bases NumPy", position: 1, fileName: "01_bases_numpy.ipynb" },
        { title: "Opération Broadcasting", position: 2, fileName: "02_operation_broadcasting.ipynb" },
        { title: "Indexing Slicing Avancé", position: 3, fileName: "03_indexing_slicing_avance.ipynb" },
      ]
    },
    {
      title: "Python - Data Science : Visualization",
      description: "Créez des graphiques impactants avec Matplotlib et Seaborn.",
      folder: "python/visualization/cours",
      chapters: [
        { title: "Matplotlib Bases", position: 1, fileName: "01_matplotlib_bases.ipynb" },
        { title: "Types Graphiques", position: 2, fileName: "02_types_graphiques.ipynb" },
        { title: "Subplots", position: 3, fileName: "03_subplots.ipynb" },
        { title: "Seaborn", position: 4, fileName: "04_seaborn.ipynb" },
      ]
    },
    {
      title: "Python - Machine Learning",
      description: "Introduction à l'apprentissage automatique avec Scikit-Learn.",
      folder: "python/machine_learning/cours",
      chapters: [
        { title: "Concepts IA", position: 1, fileName: "01_concepts_ia.ipynb" },
        { title: "Régression Linéaire", position: 2, fileName: "02_regression_lineaire.ipynb" },
        { title: "Classification KNN", position: 3, fileName: "03_classification_knn.ipynb" },
      ]
    }
  ];

  // Cleanup existing courses for this user to avoid duplication/errors
  const slugsToCheck = coursesData.map(c => slugify(c.title));
  await db.course.deleteMany({
    where: {
      instructorId: user.id,
      slug: { in: slugsToCheck }
    }
  });

  const baseUrl = "https://github.com/IDOEFRAIM/formations/blob/master/";

  for (const courseData of coursesData) {
    console.log(`Creating course: ${courseData.title}`);

    // Create Course
    const course = await db.course.create({
      data: {
        instructorId: user.id,
        title: courseData.title,
        description: courseData.description,
        categoryId: category.id,
        status: "PUBLISHED",
        slug: slugify(courseData.title),
      },
    });

    // Create Chapters
    for (const chapterData of courseData.chapters) {
      const chapter = await db.chapter.create({
        data: {
          title: chapterData.title,
          courseId: course.id,
          position: chapterData.position,
          status: "PUBLISHED",
          description: `Chapter for ${chapterData.title}`,
        },
      });

      const githubLink = `${baseUrl}${courseData.folder}/${chapterData.fileName}`;

      // Create a default Lesson for the chapter
      await db.lesson.create({
        data: {
          title: `${chapterData.title} - Code Source`,
          chapterId: chapter.id,
          position: 1,
          status: "PUBLISHED",
          description: `
**Accéder au code source du cours :**

[📄 Voir le notebook sur GitHub](${githubLink})

Ce notebook contient tout le code et les explications pour cette partie du cours.
          `,
        }
      });
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
