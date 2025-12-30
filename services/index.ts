import { AuthService } from "./auth";
import { CoursesService } from "./courses";
import { UserService } from "./user";
import { UploadService } from "./upload";
import { ProgressService } from "./progress";
import { ChaptersService } from "./chapters";
import { LessonsService } from "./lessons";

/**
 * TANKAACADEMY Services Layer
 * Centralisation de toute la logique métier.
 */
export {
  AuthService,
  CoursesService,
  UserService,
  UploadService,
  ProgressService,
  ChaptersService,
  LessonsService,
};

/**
 * Astuce : Tu peux aussi créer un objet global si tu préfères 
 * l'appelation 'api.courses.get()'
 */
export const api = {
  auth: AuthService,
  course: CoursesService,
  user: UserService,
  upload: UploadService,
};