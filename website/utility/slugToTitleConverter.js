const slugToTitle = (slug) => {
	return slug
	  .replace(/-/g, ' ') 
	  .replace(/^./, char => char.toUpperCase()); 
  }
export default slugToTitle;