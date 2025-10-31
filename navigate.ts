    navigateInternal: (path) => {
      const currentUrl = window.location.hash.slice(1);
      navigate(path);
      // Restore the URL immediately after navigation
      setTimeout(() => {
        window.history.replaceState(null, '', `#${currentUrl}`);
      }, 0);
    },
