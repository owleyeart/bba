/////////////////////////////////////////////////////// 
// Bob Baker - Bob Baker Art, April 2025     //
// t_r_a_n_s_f_i_x Project Page                      //
///////////////////////////////////////////////////////

import React, { useEffect } from 'react';
import './Transfix.css';

export default function Transfix() {
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }, []);

  return (
    <>
      <div className="route-container transfix-wrapper">
        <div className="glass-panel">

          {/* 🎥 Video Embed */}
          <div className="video-container">
            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/me4WsFaWDE4"
              title="t_r_a_n_s_f_i_x by Bob Baker"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

        {/* 🔤 Title */}
        <h1 className="observed-title">t_r_a_n_s_f_i_x</h1>
        <p className="transfix-subtitle">by Bob Baker, (2023)</p>


          {/* 📝 Artist Statement */}
          <div className="artist-statement">
            <h2>Artist Statement</h2>
            <p>
              The artist is captivated by the continual start and stop of the creative process. The building and rebuilding of ideas.
              The churn that never ceases as the artist doubles back over their work, adjusting and re-adjusting, adding minute changes
              to seek the elusive perfection that never seems reachable. Ideas rarely come to fruition the way they are first imagined.
              A plan —once solid— soon turns malleable in a process that ebbs and flows with new creation. This endeavor remains one that
              seems to hold the artist in focus while they struggle.
            </p>

            <p>
              To be transfixed is to be held in astonishment or awe, occasionally in fear. The artist cannot break free from this grasp while
              they are transfixed. The artist experiences this during their creation. Viewers of art are held transfixed while they observe
              an artist’s creation, as if the energy of the artist’s transfixation has been transferred to the viewer.
            </p>

            <p>
              Linguists state that transfixes are affixes added to a root word. Like prefixes added to the beginning of a root word, or suffixes
              added to the end of a root word, transfixes are inserted into the root word. Only a handful of languages in the world utilize
              transfixes such as Arabic, Hebrew and some African languages.
            </p>

            <p>
              A prefix like <strong>dis-</strong> can be added to the root word <em>appear</em> to create a new word <em>disappear</em>. Similarly, a suffix like <strong>-ed</strong> can be added
              to the end of a root word to create a new word: <em>appeared</em>. Or a prefix and suffix can be added to the root to create a new word: <em>disappeared</em>.
            </p>

            <p>
              Transfixes are added inside of a root word. The Arabic word <em>slm</em> means peace. Vowels such as <em>a</em> and <em>i</em> can be added inside <em>slm </em>
            in different combinations to create new words.
            </p>

            <p><em>salama</em> thus creates "peace be upon you".</p>
            <p><em>salima</em> gives us "safety and security".</p>
            <p><em>islam</em> brings forth "peaceful submission to God’s teachings".</p>

            <p>
              Art similarly takes “root” ideas and adds to them in various forms over time. We tear apart ideas and add information and details
              to them creating entirely new ideas in the process. It is the intense focus on these additions to our ideas that creates new art
              and holds our attention —and the attention of our viewers— through time.
            </p>
          </div>
        </div>
        <br></br>
      </div>
    </>
  );
}
