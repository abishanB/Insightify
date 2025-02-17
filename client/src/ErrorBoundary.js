import React from "react";
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg:null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMsg: error.message};
  }


  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <React.Fragment>
          <h1>Error</h1>
          <p>{this.state.errorMsg}</p>
          <p>{this.props.fallback}</p>
        </React.Fragment>
      )
    }

    return this.props.children;
  }
}