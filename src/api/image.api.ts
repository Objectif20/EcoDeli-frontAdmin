export const uploadImage = async (image: File, bucket : string): Promise<string> => {
  try {

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Image uploadée avec succès", image.name);
    console.log("Bucket", bucket);

    return "https://cdn.futura-sciences.com/sources/images/dossier/773/01-intro-773.jpg";
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    throw new Error("L'upload a échoué");
  }
};