import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background: #f8f8f8;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #eee;
`;

const Footer = () => (
  <FooterWrapper>
    <p>&copy; 2025 Shoe Store. All rights reserved.</p>
    <a href="#">Size Guide</a> | <a href="#">Contact</a>
  </FooterWrapper>
);

export default Footer;