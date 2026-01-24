"use client";

import { useState, useEffect, useCallback } from "react";
import { Course } from "@/types";
import { CoursesService } from "@/services";

interface UseCoursesProps {
  categoryId?: string;
  title?: string;
  instructorId?: string;
}

/**
 * Hook pour gérer des listes de cours avec filtres.
 * Utilisé dans le dashboard instructeur et le catalogue.
 */
export const useCourses = (filters: UseCoursesProps = {}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On crée une clé unique basée sur les valeurs des filtres.
  // Cela évite que le useEffect se relance à chaque rendu si l'objet 
  // 'filters' est recréé mais que ses valeurs n'ont pas changé.
  const filterKey = JSON.stringify({
    categoryId: filters.categoryId,
    title: filters.title,
    instructorId: filters.instructorId
  });

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let data;
      
      // Logique de récupération :
      if (filters.instructorId) {
        // Mode Dashboard Instructeur
        data = await CoursesService.getInstructorCourses(filters.instructorId);
      } else {
        // Mode Catalogue Public
        // Note: Si getPublicCourses n'est pas encore prêt, on utilise une liste vide ou getInstructorCourses("")
        data = await CoursesService.getInstructorCourses(""); 
      }

      // LE CORRECTIF TYPE : On utilise "unknown" comme pivot pour 
      // transformer les données Prisma en ton interface "Course"
      setCourses(data as unknown as Course[]);

    } catch (err) {
      console.error("Erreur useCourses:", err);
      setError("Impossible de récupérer les cours.");
    } finally {
      setIsLoading(false);
    }
  }, [filterKey]); // Le fetch dépend uniquement du changement réel des valeurs de filtres

  // Déclenchement automatique au montage et au changement de filtres
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    isLoading,
    error,
    // Permet de forcer un rafraîchissement (ex: après une suppression)
    refresh: fetchCourses, 
    count: courses.length
  };
};