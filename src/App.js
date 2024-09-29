import React, { useState, useEffect } from 'react';
   import { HashRouter as Router, Route, Link, Routes, useParams } from 'react-router-dom';
   import ReactMarkdown from 'react-markdown';

const MarkdownPage = () => {
  const [content, setContent] = useState('');
  const { page } = useParams();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/amo-dta/democsm/contents/${page || 'home'}.md`);
        const data = await response.json();
        const decodedContent = atob(data.content);
        setContent(decodedContent);
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent('# Error\nFailed to load content. Please try again later.');
      }
    };

    fetchContent();
  }, [page]);

  return <ReactMarkdown>{content}</ReactMarkdown>;
};

const App = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/amo-dta/democsm/contents/');
        const data = await response.json();
        const markdownFiles = data.filter(file => file.name.endsWith('.md'));
        setPages(markdownFiles.map(file => file.name.replace('.md', '')));
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };

    fetchPages();
  }, []);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li key="home">
              <Link to="/">Home</Link>
            </li>
            {pages.map(page => (
              <li key={page}>
                <Link to={`/${page}`}>{page.replace('-', ' ')}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<MarkdownPage />} />
          <Route path="/:page" element={<MarkdownPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;