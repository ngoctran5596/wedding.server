import authMiddleware from "../../middleware/authMiddleware";
import { Category } from "../../models/category";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const categoryList = await Category.find();
      if (!categoryList) {
        return res.status(500).json({ success: false });
      }
      return res.status(200).send(categoryList);

    case "POST":
      await authMiddleware(req, res); // Call authMiddleware
      if (!req.body.image || req.body.image.length < 2) {
        return res.status(400).send("2 ảnh trở lên!");
      }

      let category = new Category({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
      });

      category = await category.save();

      if (!category)
        return res.status(404).send("the category cannot be created!");

      return res.status(200).json(category);

    case "PATCH":
      const updatedCategory = await Category.findByIdAndUpdate(req.query.id, {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
      });

      if (!updatedCategory)
        return res.status(404).send("the category cannot be updated!");

      return res.status(200).json(updatedCategory);

    case "DELETE":
      const deletedCategory = await Category.findByIdAndDelete(req.query.id);
      if (!deletedCategory)
        return res.status(404).send("the category cannot be deleted!");
      return res.status(200).json(deletedCategory);

    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
