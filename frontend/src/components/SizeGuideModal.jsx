import styled from 'styled-components';
import { useState } from 'react';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  background: #fff;
  padding: 2rem;
  max-width: 80%;
  overflow: auto;
`;

const SizeGuideModal = ({ onClose }) => {
  const [view, setView] = useState('all'); // all, mens, womens

  // Hardcoded size data inspired by GREATS
  const sizes = [
    { cm: 23.5, in: 9.3, usMens: 6, usWomens: 8, eu: 39, uk: 5.5 },
    { cm: 24.1, in: 9.5, usMens: 6.5, usWomens: 8.5, eu: 39, uk: 6 },
    { cm: 24.4, in: 9.6, usMens: 7, usWomens: 9, eu: 40, uk: 6.5 },
    { cm: 25.4, in: 9.9, usMens: 8, usWomens: 10, eu: 41, uk: 7.5 },
    { cm: 26.7, in: 10.4, usMens: 9.5, usWomens: 11.5, eu: 42, uk: 9 },
    { cm: 27.3, in: 10.8, usMens: 10.5, usWomens: null, eu: 43, uk: 10 },
    { cm: 28.6, in: 11.3, usMens: 12, usWomens: null, eu: 45, uk: 11.5 },
    { cm: 31, in: 12.2, usMens: 15, usWomens: null, eu: 48, uk: 14 },
  ];

  const filteredSizes = sizes.filter(size => {
    if (view === 'mens') return size.usMens;
    if (view === 'womens') return size.usWomens;
    return true;
  });

  return (
    <Modal onClick={onClose}>
      <Content onClick={e => e.stopPropagation()}>
        <h2>Size Guide</h2>
        <p>Match your foot length to CM/IN.</p>
        <select onChange={e => setView(e.target.value)}>
          <option value="all">All</option>
          <option value="mens">Mens</option>
          <option value="womens">Womens</option>
        </select>
        <table>
          <thead>
            <tr>
              <th>CM</th><th>IN</th><th>US Mens</th><th>US Womens</th><th>EU</th><th>UK</th>
            </tr>
          </thead>
          <tbody>
            {filteredSizes.map((size, idx) => (
              <tr key={idx}>
                <td>{size.cm}</td><td>{size.in}</td><td>{size.usMens || '-'}</td><td>{size.usWomens || '-'}</td><td>{size.eu}</td><td>{size.uk}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose}>Close</button>
      </Content>
    </Modal>
  );
};

export default SizeGuideModal;