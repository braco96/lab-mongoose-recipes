// Script principal del lab: conecta a Mongo, limpia la colección,
// crea una receta, inserta muchas, actualiza, borra y cierra la conexión.

const mongoose = require('mongoose');
const Recipe = require('./models/Recipe.model.js');
// 👇 IMPORTA EL JSON CON EXTENSIÓN
const data = require('./data.json');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/recipe-app'; // 👈 puerto estándar

mongoose.set('strictQuery', true);

(async () => {
  try {
    // 1) Conexión
    const x = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to the database: "${x.connection.name}"`);

    // 2) Limpieza
    await Recipe.deleteMany();

    // 3) Crear UNA receta (distinta a las del JSON)
    const created = await Recipe.create({
      title: 'Spaghetti Aglio e Olio',
      level: 'Easy Peasy',
      ingredients: ['Spaghetti', 'Garlic', 'Olive oil', 'Chili flakes', 'Parsley', 'Salt'],
      cuisine: 'Italian',
      dishType: 'main_course',
      duration: 20,
      creator: 'Nonna'
    });
    console.log('Created recipe:', created.title);

    // 4) Insertar múltiples (las del JSON)
    const many = await Recipe.insertMany(data);
    console.log('Inserted recipes:', many.map(r => r.title).join(', '));

    // 5) Actualizar duración de "Rigatoni alla Genovese" a 100
    const updated = await Recipe.findOneAndUpdate(
      { title: 'Rigatoni alla Genovese' },
      { duration: 100 },
      { new: true }
    );
    console.log(updated ? `Updated duration OK: ${updated.title} -> ${updated.duration}` : 'Rigatoni not found');

    // 6) Eliminar "Carrot Cake"
    const removed = await Recipe.deleteOne({ title: 'Carrot Cake' });
    console.log(removed.deletedCount === 1 ? 'Removed recipe: Carrot Cake' : 'Carrot Cake not found');
  } catch (error) {
    console.error('Error during script:', error);
  } finally {
    // 7) Cierre
    await mongoose.connection.close();
    console.log('Connection closed. Bye!');
  }
})();
