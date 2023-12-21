import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Main, {
  REQUEST_SECTION_TEST_ID,
  RESPONSE_SECTION_TEST_ID,
} from '../src/pages/Main/Main';
import { configureAppStore } from '../src/state/store';
import { Provider } from 'react-redux';
import QueryEditor from '../src/components/QueryEditor/QueryEditor';
import { EditorView } from 'codemirror';
import ControlPanel, {
  PRETTIFY_BTN_TEST_ID,
} from '../src/components/ControlPanel/ControlPanel';
import { queries } from './test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import { replaceEditorText } from '../src/utils/utils';
import LangState from '../src/languages/LangState';
import { Languages } from '../src/utils/enums';
import en from '../src/languages/lang/en';
import { MAIN_INTRO } from '../src/constants';

describe('Main Page', () => {
  it('contains Request and Response Sections', async () => {
    const store = configureAppStore();

    render(
      <LangState initialState={{ language: Languages.EN }}>
        <Provider store={store}>
          <Main />
        </Provider>
      </LangState>
    );

    const requestSection = await screen.findByTestId(REQUEST_SECTION_TEST_ID);
    const responseSection = await screen.findByTestId(RESPONSE_SECTION_TEST_ID);

    expect(requestSection).toBeInTheDocument();
    expect(responseSection).toBeInTheDocument();
  });
});

describe('Request Editor', () => {
  const store = configureAppStore();
  const viewRef = React.createRef<EditorView | null>();

  it('is editable', () => {
    render(
      <Provider store={store}>
        <QueryEditor mode="request" viewRef={viewRef} />
      </Provider>
    );

    const currentEditor = viewRef.current;
    expect(currentEditor).toBeInstanceOf(EditorView);

    if (currentEditor instanceof EditorView) {
      expect(currentEditor.state.facet(EditorView.editable)).toBeTruthy();
    }
  });

  it('contains introduction text', () => {
    const defaultQueryString = en[MAIN_INTRO];

    render(
      <Provider store={store}>
        <QueryEditor
          mode="request"
          viewRef={viewRef}
          text={defaultQueryString}
        />
      </Provider>
    );

    const currentEditor = viewRef.current;
    expect(currentEditor).toBeInstanceOf(EditorView);

    if (currentEditor instanceof EditorView) {
      expect(currentEditor.state.doc.toString()).toEqual(defaultQueryString);
    }
  });
});

describe('Response Editor', () => {
  it('is readonly', () => {
    const store = configureAppStore();
    const viewRef = React.createRef<EditorView | null>();

    render(
      <Provider store={store}>
        <QueryEditor mode="response" viewRef={viewRef} />
      </Provider>
    );

    const currentEditor = viewRef.current;

    expect(currentEditor).toBeInstanceOf(EditorView);

    if (currentEditor instanceof EditorView) {
      expect(currentEditor.state.facet(EditorView.editable)).toBeFalsy();
    }
  });
});

describe('Prettify button', () => {
  it('prettifies query string', async () => {
    const store = configureAppStore();
    const requestViewRef = React.createRef<EditorView | null>();
    const responseViewRef = React.createRef<EditorView | null>();
    const variablesViewRef = React.createRef<EditorView | null>();
    const headersViewRef = React.createRef<EditorView | null>();
    const setIsLoading = vi.fn();

    render(
      <LangState initialState={{ language: Languages.EN }}>
        <Provider store={store}>
          <QueryEditor mode="response" viewRef={requestViewRef} />
          <ControlPanel
            requestViewRef={requestViewRef}
            responseViewRef={responseViewRef}
            variablesViewRef={variablesViewRef}
            headersViewRef={headersViewRef}
            setIsLoading={setIsLoading}
          />
        </Provider>
      </LangState>
    );

    const requestEditor = requestViewRef.current;
    const prettifyBtn = screen.getByTestId(PRETTIFY_BTN_TEST_ID);

    expect(prettifyBtn).toBeInTheDocument();
    expect(requestEditor).toBeInstanceOf(EditorView);

    if (requestEditor instanceof EditorView) {
      for (const query of queries) {
        const initial = query.initial;
        const prettified = query.prettified;

        replaceEditorText(requestViewRef, initial);
        expect(requestEditor.state.doc.toString()).toEqual(initial);

        await userEvent.click(prettifyBtn);

        expect(requestEditor.state.doc.toString()).toEqual(prettified);
      }
    }
  });
});
