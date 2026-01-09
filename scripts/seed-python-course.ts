import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  const email = "efra@gmail.com";

  console.log(`Recherche du formateur ${email}...`);
  let instructor = await db.user.findUnique({
    where: { email },
  });

  if (!instructor) {
    console.log(`Formateur ${email} introuvable. Création du compte...`);
    instructor = await db.user.create({
      data: {
        email,
        name: "Efraim",
        role: "INSTRUCTOR", // Ensure they have the right role
      }
    });
    console.log(`Formateur créé : ${instructor.id}`);
  } else {
      // Ensure they are instructor
      if (instructor.role !== "INSTRUCTOR") {
          await db.user.update({
              where: { id: instructor.id },
              data: { role: "INSTRUCTOR" }
          });
          console.log("Rôle mis à jour en INSTRUCTOR");
      }
  }

  console.log("Recherche de la catégorie 'Informatique'...");
  let category = await db.category.findUnique({ where: { name: "Informatique" } });
  
  if (!category) {
    category = await db.category.create({ data: { name: "Informatique" } });
  }

  console.log("Nettoyage des anciens cours 'Python Débutant' et 'Formation Complète Python'...");
  await db.course.deleteMany({
    where: {
      instructorId: instructor.id,
      title: { in: ["Python Débutant", "Formation Complète Python : De Débutant à Expert"] }
    }
  });

  console.log("Création du cours 'Formation Complète Python : De Débutant à Expert'...");
  
  const course = await db.course.create({
    data: {
      instructorId: instructor.id,
      title: "Formation Complète Python : De Débutant à Expert",
      slug: "python-complete-formation-" + Date.now(),
      description: "<p>Maîtrisez Python, de la syntaxe de base aux concepts avancés en passant par l'analyse de données et le développement asynchrone.</p><p>Ce cours est structuré en 3 niveaux : Débutant, Intermédiaire et Avancé.</p>",
      status: "PUBLISHED",
      categoryId: category.id,
      image: "https://www.python.org/static/community_logos/python-logo-master-v3-TM.png", // Add an image to avoid blank card
      chapters: {
        create: [
          // NIVEAU 1 : BASES
          {
            title: "Niveau 1 : Les Bases",
            position: 1,
            status: "PUBLISHED",
            lessons: {
              create: [
                { 
                  title: "Introduction à Python", 
                  position: 1, 
                  status: "PUBLISHED", 
                  description: `
                    <h3>Introduction</h3>
                    <p>Python est un langage de programmation interprété, interactif et orienté objet. Il est facile à apprendre et puissant.</p>
                    <p>Dans cette leçon, nous allons voir comment installer Python et configurer votre environnement.</p>
                    <h4>Exemple de code :</h4>
                    <pre class="ql-syntax" spellcheck="false">print("Hello World")</pre>
                    <p><br></p>
                    <p><strong>Ressources :</strong></p>
                    <p>Téléchargez le fichier source de cette leçon ici : <a href="https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/01_introduction_python.ipynb" target="_blank" rel="noopener noreferrer">01_introduction_python.ipynb</a></p>
                  `
                },
                { 
                  title: "Bases & Syntaxe", 
                  position: 2, 
                  status: "PUBLISHED", 
                  description: `
                    <h3>Syntaxe de Base</h3>
                    <p>Variables et types.</p>
                    <p>Fichier source : <a href="https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/02_bases_syntaxe.ipynb" target="_blank">02_bases_syntaxe.ipynb</a></p>
                  `
                },
                { title: "Opérateurs & Conditions", position: 3, status: "PUBLISHED", description: "<p>if, else, elif</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/03_operateurs_conditions.ipynb'>03_operateurs_conditions.ipynb</a></p>" },
                { title: "Boucles", position: 4, status: "PUBLISHED", description: "<p>for, while</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/04_boucles.ipynb'>04_boucles.ipynb</a></p>" },
                { title: "Listes & Tuples", position: 5, status: "PUBLISHED", description: "<p>Structures de données de base.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/05_listes_tuples.ipynb'>05_listes_tuples.ipynb</a></p>" },
                { title: "Dictionnaires", position: 6, status: "PUBLISHED", description: "<p>Clés et valeurs.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/06_dictionnaires.ipynb'>06_dictionnaires.ipynb</a></p>" },
                { title: "Fonctions", position: 7, status: "PUBLISHED", description: "<p>Découper son code.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/07_fonctions.ipynb'>07_fonctions.ipynb</a></p>" },
                { title: "Modules & Erreurs", position: 8, status: "PUBLISHED", description: "<p>Imports et gestion des exceptions (try/except).</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/cours/08_modules_erreurs.ipynb'>08_modules_erreurs.ipynb</a></p>" },
              ]
            }
          },

          // NIVEAU 2 : INTERMÉDIAIRE
          {
            title: "Niveau 2 : Intermédiaire",
            position: 2,
            status: "PUBLISHED",
            lessons: {
              create: [
                { 
                  title: "Gestion de Fichiers", 
                  position: 1, 
                  status: "PUBLISHED", 
                  description: `
                    <h3>Lire et écrire des fichiers texte</h3>
                    <p>Apprenez à manipuler des fichiers externes avec Python.</p>
                    <pre class="ql-syntax" spellcheck="false">with open("fichier.txt", "r") as f:\n    contenu = f.read()</pre>
                    <p><br></p>
                    <p><strong>Ressources :</strong></p>
                    <p>Fichier source : <a href="https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/01_gestion_fichiers.ipynb" target="_blank">01_gestion_fichiers.ipynb</a></p>
                  `
                },
                { title: "Compréhensions de Listes", position: 2, status: "PUBLISHED", description: "<p>Écrire du code concis et puissant pour créer des listes.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/02_comprehensions_listes.ipynb'>02_comprehensions_listes.ipynb</a></p>" },
                { title: "POO : Classes", position: 3, status: "PUBLISHED", description: "<p>Programmation Orientée Objet : Les bases des Classes et Objets.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/03_poo_classes.ipynb'>03_poo_classes.ipynb</a></p>" },
                { title: "POO : Héritage", position: 4, status: "PUBLISHED", description: "<p>Héritage et Polymorphisme pour structurer des programmes complexes.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/04_poo_heritage.ipynb'>04_poo_heritage.ipynb</a></p>" },
                { title: "Fonctions Avancées", position: 5, status: "PUBLISHED", description: "<p>Fonctions lambda, *args et **kwargs.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/05_fonctions_avancees.ipynb'>05_fonctions_avancees.ipynb</a></p>" },
                { title: "Décorateurs", position: 6, status: "PUBLISHED", description: "<p>Modifier le comportement des fonctions sans les changer.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/06_decorateurs.ipynb'>06_decorateurs.ipynb</a></p>" },
                { title: "Itérateurs & Générateurs", position: 7, status: "PUBLISHED", description: "<p>Utilisation de yield pour une itération efficace.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/07_iterateurs_generateurs.ipynb'>07_iterateurs_generateurs.ipynb</a></p>" },
                { title: "Sérialisation (JSON/CSV)", position: 8, status: "PUBLISHED", description: "<p>Travailler avec des formats de données standards.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/08_serialisation_json_csv.ipynb'>08_serialisation_json_csv.ipynb</a></p>" },
                { title: "Dates & Heures", position: 9, status: "PUBLISHED", description: "<p>Maîtriser le module datetime.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/09_dates_heures.ipynb'>09_dates_heures.ipynb</a></p>" },
                { title: "Récursivité", position: 10, status: "PUBLISHED", description: "<p>Comprendre les fonctions qui s'appellent elles-mêmes.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/intermediate/10_recursivite.ipynb'>10_recursivite.ipynb</a></p>" },
              ]
            }
          },

          // NIVEAU 3 : AVANCÉ
          {
            title: "Niveau 3 : Avancé",
            position: 3,
            status: "PUBLISHED",
            lessons: {
              create: [
                { 
                  title: "Requêtes API", 
                  position: 1, 
                  status: "PUBLISHED", 
                  description: `
                    <h3>Interagir avec le Web</h3>
                    <p>Utiliser la bibliothèque requests pour consommer des API.</p>
                    <p>Fichier source : <a href="https://github.com/IDOEFRAIM/formations/blob/master/python/advance/01_requetes_api.ipynb" target="_blank">01_requetes_api.ipynb</a></p>
                  `
                },
                { title: "Expressions Régulières (Regex)", position: 2, status: "PUBLISHED", description: "<p>Manipuler du texte de façon avancée.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/02_regex.ipynb'>02_regex.ipynb</a></p>" },
                { title: "Bases de données (SQLite)", position: 3, status: "PUBLISHED", description: "<p>SQL et persistance de données avec SQLite.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/03_bases_de_donnees_sqlite.ipynb'>03_bases_de_donnees_sqlite.ipynb</a></p>" },
                { title: "Intro Data Science (Pandas)", position: 4, status: "PUBLISHED", description: "<p>Introduction à l'analyse de données avec Pandas.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/04_intro_datascience_pandas.ipynb'>04_intro_datascience_pandas.ipynb</a></p>" },
                { title: "Tests Unitaires", position: 5, status: "PUBLISHED", description: "<p>Fiabiliser son code avec unittest.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/05_tests_unitaires.ipynb'>05_tests_unitaires.ipynb</a></p>" },
                { title: "Programmation Asynchrone", position: 6, status: "PUBLISHED", description: "<p>Gagner en performance avec asyncio.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/06_asynchrone.ipynb'>06_asynchrone.ipynb</a></p>" },
                { title: "Context Managers & Typage", position: 7, status: "PUBLISHED", description: "<p>Utiliser with et le Type Hinting pour un code robuste.</p><p>Fichier source : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/advance/07_gestionnaires_contexte_et_typage.ipynb'>07_gestionnaires_contexte_et_typage.ipynb</a></p>" },
              ]
            }
          },
          
          // TRAVAUX PRATIQUES (MODULÉS)
          {
            title: "Projets & TP",
            position: 4,
            status: "PUBLISHED",
            lessons: {
              create: [
                { title: "TP : Gestion d'un Maquis", position: 1, status: "PUBLISHED", description: "<p>Mini-projet de gestion de commande.</p><p>Fichier : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/tp/tp_gestion_maquis.ipynb'>tp_gestion_maquis.ipynb</a></p>" },
                { title: "TP : Menu USSD", position: 2, status: "PUBLISHED", description: "<p>Simulation d'un menu téléphonique.</p><p>Fichier : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/tp/tp_menu_ussd.ipynb'>tp_menu_ussd.ipynb</a></p>" },
                { title: "TP : Tontine Communautaire", position: 3, status: "PUBLISHED", description: "<p>Gestion d'épargne communautaire.</p><p>Fichier : <a href='https://github.com/IDOEFRAIM/formations/blob/master/python/basic/tp/tp_tontine_communautaire.ipynb'>tp_tontine_communautaire.ipynb</a></p>" },
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`Cours '${course.title}' créé avec succès ! (ID: ${course.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
