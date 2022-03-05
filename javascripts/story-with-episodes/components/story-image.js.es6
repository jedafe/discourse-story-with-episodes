import Category from "discourse/models/category";
import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
export default Component.extend({
  isStoryTopic: false,
  imageURL: null,
  @discourseComputed("topic.category_id", "topic.tags")
  isStoryTopic(categoryId, topicTags) {
    let hasCategory = false;
    let hasTag = false;

    if(settings.no_images) {
      return false;
    }

    if(categoryId) {
      const allowedCategories = settings.story_category.split(",");
      const currentCategory = Category.findById(categoryId);
      const parentCategorySlug = currentCategory.parentCategory ? `${currentCategory.parentCategory.slug}-` : "";
      hasCategory = allowedCategories.some((c) => c.trim() === `${parentCategorySlug}${currentCategory.slug}`);
    }

    if(topicTags) {
      const allowedTags = settings.story_tag.split("|");
      hasTag = allowedTags.some((tag) => topicTags.includes(tag));
    }

    return hasCategory || hasTag;
  },
  @discourseComputed("topic.thumbnails")
  imageURL(thumbnails) {
    if(thumbnails) {
      return thumbnails[0].url;
    }
  },
});
