import React, { useState } from 'react';
import classNames from 'classnames';
import { string, func, number } from 'prop-types';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import 'react-gh-like-diff/lib/diff2html.css';
import { THEME } from '../../utils/constants';

const styles = withStyles(theme => {
  const borderColor =
    theme.palette.type === 'light'
      ? fade(theme.palette.common.black, 0.23)
      : fade(theme.palette.common.white, 0.23);

  return {
    '@global': {
      '.d2h-diff-table': {
        '& .d2h-cntx': {
          background: theme.palette.background.paper,
        },
        '& .d2h-code-side-linenumber.d2h-cntx': {
          background: theme.palette.background.paper,
          color: theme.palette.text.secondary,
        },
        '& .d2h-code-side-linenumber.d2h-del': {
          color: THEME.PRIMARY_TEXT_DARK,
        },
        '& .d2h-code-side-linenumber.d2h-ins': {
          color: THEME.PRIMARY_TEXT_DARK,
        },
        '& .d2h-code-side-linenumber': {
          border: `solid ${theme.palette.divider}`,
          borderWidth: `0 1px 0 1px`,
        },
        '& .d2h-code-side-linenumber.d2h-code-side-emptyplaceholder.d2h-cntx.d2h-emptyplaceholder': {
          background: theme.palette.grey['500'],
        },
        '& .d2h-ins': {
          borderColor: 'none',
          backgroundColor: theme.palette.diff.green.line,
          color: THEME.PRIMARY_TEXT_DARK,
        },
        '& .d2h-del': {
          borderColor: 'none',
          backgroundColor: theme.palette.diff.red.line,
          color: THEME.PRIMARY_TEXT_DARK,
        },
        '& .d2h-code-line ins, & .d2h-code-side-line ins': {
          backgroundColor: theme.palette.diff.green.word,
        },
        '& .d2h-code-line del, & .d2h-code-side-line del': {
          backgroundColor: theme.palette.diff.red.word,
        },
        '& .d2h-code-side-emptyplaceholder, & .d2h-emptyplaceholder': {
          backgroundColor: theme.palette.grey['500'],
        },
      },
    },
    tab: {
      flexGrow: 1,
    },
    tabContent: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(1),
    },
    diffContainer: {
      borderColor,
      borderWidth: 1,
      borderRadius: theme.shape.borderRadius,
      borderStyle: 'solid',
    },
  };
});

/**
 * An input text field with a diff view feature.
 * Refer to `mozilla-frontend-infra/components` MarkdownTextArea components
 * ref: https://github.com/mozilla-frontend-infra/components/blob/master/src/components/MarkdownTextArea/index.jsx
 */
function DiffTextArea(props) {
  const { classes, onChange, rows, initialValue, ...rest } = props;
  const [tabIndex, setTabIndex] = useState(props.defaultTabIndex);
  const [value, setValue] = useState(props.value);
  const isViewDiff = tabIndex === 1;
  const isNotEqualText = initialValue !== value;
  const isControlled =
    'value' in props && props.value !== undefined && props.value !== null;

  function handleValueChange(event) {
    if (isControlled) {
      setValue(event.target.value);

      return onChange(event);
    }

    setValue(event.target.value);
  }

  function handleTabChange(event, value) {
    setTabIndex(value);
  }

  return (
    <div className={classNames(classes.tab)}>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Scopes" />
        <Tab label="View Diff" />
      </Tabs>
      <div
        style={isViewDiff ? { minHeight: rows * 20 } : null}
        className={classNames(classes.tabContent, {
          [classes.diffContainer]: isViewDiff,
        })}>
        {!isViewDiff && (
          <TextField
            onChange={handleValueChange}
            fullWidth
            multiline
            rows={rows}
            {...rest}
            value={value}
          />
        )}
        {isViewDiff && isNotEqualText && (
          <ReactGhLikeDiff past={initialValue} current={value} />
        )}
      </div>
    </div>
  );
}

DiffTextArea.propTypes = {
  /**
   * A function to handle changes to the diff text.
   * Required for a controlled component.
   */
  onChange: func,
  /**
   * The input value for the diff text.
   * Required for a controlled component.
   */
  value: string,
  /**
   * The initial value to compare with changed text
   */
  initialValue: string,
  /**
   * A placeholder value used for the diff text.
   */
  placeholder: string,
  /**
   * An index number used to control which tab is selected as default.
   */
  defaultTabIndex: number,
  /**
   * A number used to control the amount of rows displayed for the input area.
   */
  rows: number,
};

DiffTextArea.defaultProps = {
  onChange: null,
  value: undefined,
  placeholder: null,
  defaultTabIndex: 0,
  rows: 5,
};

export default styles(DiffTextArea);
