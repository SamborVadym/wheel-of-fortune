import React from 'react';
const ShareButtons = ({ title }) => {

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => console.log('Text copied to clipboard!'),
      (err) => console.error('Failed to copy text: ', err),
    );
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=https://example.com&quote=${title}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${title}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?title=${title}&url=https://example.com`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareOnReddit = () => {
    const url = `https://reddit.com/submit?title=${title}&url=https://example.com`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <button onClick={() => copyToClipboard(title)}>Copy Title</button>
      <button onClick={shareOnFacebook}>Share on Facebook</button>
      <button onClick={shareOnTwitter}>Share on Twitter</button>
      <button onClick={shareOnLinkedIn}>Share on LinkedIn</button>
      <button onClick={shareOnReddit}>Share on Reddit</button>
    </div>
  );
};

export default ShareButtons;