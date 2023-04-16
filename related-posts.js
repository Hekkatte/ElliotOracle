function fetchBlogPosts(callback) {
  fetch('/blog?format=json&showCategories=true&showTags=true')
    .then(response => response.json())
    .then(data => callback(data));
}
function findRelatedPosts(currentPost, allPosts) {
  const relatedPosts = allPosts.filter(post => {
    // Exclude the current post
    if (post.id === currentPost.id) return false;

    // Check for overlapping categories or tags
    const commonCategories = post.categories.filter(category =>
      currentPost.categories.includes(category)
    );
    const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag));

    return commonCategories.length > 0 || commonTags.length > 0;
  });

  return relatedPosts;
}
function generateSummaryBlock(relatedPosts) {
  // Add your desired summary block HTML structure here
  // Customize the appearance using Squarespace's CSS classes or your own

  return `
    <div class="related-posts">
      ${relatedPosts.map(post => `
        <div class="related-post">
          <a href="${post.fullUrl}">
            <h3>${post.title}</h3>
          </a>
        </div>
      `).join('')}
    </div>
  `;
}
function initRelatedPostsPlugin() {
  // Check if the current page is a blog item
  if (!document.querySelector('.collection-type-blog.view-item')) return;

  // Get the current post ID from the page URL
  const currentPostId = window.location.pathname.split('/').pop();

  fetchBlogPosts(data => {
    const currentPost = data.items.find(post => post.id === currentPostId);
    const relatedPosts = findRelatedPosts(currentPost, data.items);
    const summaryBlock = generateSummaryBlock(relatedPosts);

    // Insert the summary block into your page (e.g., at the end of the blog post)
    document.querySelector('.entry-content').insertAdjacentHTML('beforeend', summaryBlock);
  });
}

document.addEventListener('DOMContentLoaded', initRelatedPostsPlugin);
