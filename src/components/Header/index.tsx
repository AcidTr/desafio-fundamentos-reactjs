import React from 'react';

import { Link, NavLink } from 'react-router-dom';

import { Container } from './styles';

import Logo from '../../assets/logo.svg';

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }: HeaderProps) => (
  <Container size={size}>
    <header>
      <img src={Logo} alt="GoFinances" />
      <nav>
        <NavLink to="/" activeClassName="selected">
          <strong>Listagem</strong>
        </NavLink>
        <NavLink to="/import" activeClassName="selected">
          <strong>Importar</strong>
        </NavLink>
      </nav>
    </header>
  </Container>
);

export default Header;
