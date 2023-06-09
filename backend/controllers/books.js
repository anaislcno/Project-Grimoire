const Book = require("../models/Book");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

exports.createBook = async (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const { filename: image } = req.file;

  await sharp(req.file.path)
    .resize(500)
    .jpeg({ quality: 80 })
    .toFile(path.resolve(req.file.destination, "library", image))
    .then(() => {
      fs.unlinkSync(req.file.path);
    })
    .catch((error) => {
      console.error(error);
    });

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/library/${req.file.filename}`,
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/library/${req.file.filename}`,
      }
    : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Unauthorized request" });
      } else {
        if (req.file) {
          try {
            const filename = book.imageUrl.split("/images/library/")[1];
            fs.unlinkSync(`images/library/${filename}`);
          } catch (error) {
            console.error("suppression pas ok", error);
          }

          sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 80 })
            .toFile(path.resolve(req.file.destination, "library", req.file.filename))
            .then(() => {
              fs.unlinkSync(req.file.path);
            })
            .catch((error) => {
              console.error(error);
            });
        }

        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Unauthorized request" });
      } else {
        const filename = book.imageUrl.split("/images/library/")[1];
        fs.unlink(`images/library/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body;
  const bookId = req.params.id;

  Book.findById(bookId)
    .then((book) => {
      const existingRating = book.ratings.find((rating) => rating.userId === userId);

      if (existingRating) {
        res.status(400).json({ message: "Vous avez déjà noté ce livre." });
      } else {
        book.ratings.push({
          userId: userId,
          grade: rating,
        });

        const totalRatings = book.ratings.length;
        const sumOfRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        book.averageRating = sumOfRatings / totalRatings;

        book
          .save()
          .then((book) => res.status(200).json(book))
          .catch((error) => {
            return res.status(400).json({ error });
          });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.getTopRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trier par note moyenne décroissante
    .limit(3) // Récupérer les trois premiers livres
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
