import { useNavigate, useLocation, useParams } from 'react-router-dom';

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let navigate = useNavigate();
    let location = useLocation();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ navigate, location, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}
