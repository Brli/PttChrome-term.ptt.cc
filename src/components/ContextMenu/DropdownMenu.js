import cx from "classnames";
import React from "react";
import { compose, lifecycle, withHandlers } from "recompose";
import { Dropdown } from "react-bootstrap";
import { i18n } from "../../js/i18n";
import "./DropdownMenu.css";

const top = (mouseHeight, menuHeight) => {
  const pageHeight = window.innerHeight;

  // opening menu would pass the bottom of the page
  if (mouseHeight + menuHeight > pageHeight && menuHeight < mouseHeight) {
    return mouseHeight - menuHeight;
  }
  return mouseHeight;
};

const left = (mouseWidth, menuWidth) => {
  const pageWidth = window.innerWidth;

  // opening menu would pass the side of the page
  if (mouseWidth + menuWidth > pageWidth && menuWidth < mouseWidth) {
    return mouseWidth - menuWidth;
  }
  return mouseWidth;
};

const normalizeSelectedText = selectedText => {
  if (selectedText.length > 15) {
    return `${selectedText.substr(0, 15)} …`;
  }
  return selectedText;
};

const QUICK_SEARCH = {
  providers: [
    {
      name: "goo.gl",
      url: "https://goo.gl/%s"
    }
  ]
};

const enhance = compose(
  withHandlers(() => {
    const refs = {};

    return {
      onDropdownMenuMount: () => ref => {
        refs.dropdownMenu = ref;
      },
      onMousePositionChange: ({ pageX, pageY }) => () => {
        refs.dropdownMenu.style.cssText += `
          top:${top(pageY, refs.dropdownMenu.clientHeight)}px;
          left:${left(pageX, refs.dropdownMenu.clientWidth)}px;
        `;
      },
      onContextMenu: () => event => {
        event.stopPropagation();
        event.preventDefault();
      }
    };
  }),
  lifecycle({
    componentDidMount() {
      this.props.onMousePositionChange();
    },
    componentDidUpdate(prevProps) {
      if (
        this.props.pageX !== prevProps.pageX ||
        this.props.pageY !== prevProps.pageY
      ) {
        this.props.onMousePositionChange();
      }
    }
  })
);

export const DropdownMenu = ({
  pageX,
  pageY,
  urlEnabled,
  normalEnabled,
  selEnabled,
  mouseBrowsingEnabled,
  selectedText,
  onMenuSelect,
  onInputHelperClick,
  onLiveArticleHelperClick,
  onSettingsClick,
  onQuickSearchSelect,
  //
  onDropdownMenuMount,
  onContextMenu
}) => (
  <ul
    className="dropdown-menu DropdownMenu--reset"
    ref={onDropdownMenuMount}
    onContextMenu={onContextMenu}
  >
    {selEnabled && (
      <React.Fragment>
        <Dropdown.Item eventKey="copy" onSelect={onMenuSelect}>
          {i18n("cmenu_copy")}
          <span className="DropdownMenu__Item__HotKey">Ctrl+C</span>
        </Dropdown.Item>
        <Dropdown.Item eventKey="copyAnsi" onSelect={onMenuSelect}>
          {i18n("cmenu_copyAnsi")}
        </Dropdown.Item>
      </React.Fragment>
    )}
    {normalEnabled && (
      <Dropdown.Item eventKey="paste" onSelect={onMenuSelect}>
        {i18n("cmenu_paste")}
        <span className="DropdownMenu__Item__HotKey">Shift+Insert</span>
      </Dropdown.Item>
    )}
    {selEnabled && (
      <Dropdown.Item eventKey="searchGoogle" onSelect={onMenuSelect}>
        {i18n("cmenu_searchGoogle")}{" "}
        <span>'{normalizeSelectedText(selectedText)}'</span>
      </Dropdown.Item>
    )}
    {urlEnabled && (
      <React.Fragment>
        <Dropdown.Item eventKey="openUrlNewTab" onSelect={onMenuSelect}>
          {i18n("cmenu_openUrlNewTab")}
        </Dropdown.Item>
        <Dropdown.Item eventKey="copyLinkUrl" onSelect={onMenuSelect}>
          {i18n("cmenu_copyLinkUrl")}
        </Dropdown.Item>
      </React.Fragment>
    )}
    <Dropdown.Item divider />
    {selEnabled && (
      <React.Fragment>
        <Dropdown.Item className="DropdownMenu__Item--quickSearch">
          {i18n("cmenu_quickSearch")}{" "}
          <span style={{ float: "right" }}>&#9658;</span>
          <ul
            className={cx(
              "dropdown-menu",
              "DropdownMenu--reset",
              "QuickSearchMenu",
              {
                "QuickSearchMenu--up": pageY > window.innerHeight / 2,
                "QuickSearchMenu--left": pageX > window.innerWidth * 0.7
              }
            )}
            role="menu"
          >
            {QUICK_SEARCH.providers.map(p => (
              <Dropdown.Item
                key={p.url}
                eventKey={p.url}
                onSelect={onQuickSearchSelect}
              >
                {p.name}
              </Dropdown.Item>
            ))}
          </ul>
        </Dropdown.Item>
        <Dropdown.Item divider />
      </React.Fragment>
    )}
    {normalEnabled && (
      <React.Fragment>
        <Dropdown.Item eventKey="selectAll" onSelect={onMenuSelect}>
          {i18n("cmenu_selectAll")}
          <span className="DropdownMenu__Item__HotKey">Ctrl+A</span>
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="mouseBrowsing"
          onSelect={onMenuSelect}
          className={cx({
            "DropdownMenu__Item--checked": mouseBrowsingEnabled
          })}
        >
          {i18n("cmenu_mouseBrowsing")}
        </Dropdown.Item>
        <Dropdown.Item onClick={onInputHelperClick}>
          {i18n("cmenu_showInputHelper")}
        </Dropdown.Item>
        <Dropdown.Item onClick={onLiveArticleHelperClick}>
          {i18n("cmenu_showLiveArticleHelper")}
        </Dropdown.Item>
        <Dropdown.Item divider />
      </React.Fragment>
    )}
    <Dropdown.Item onClick={onSettingsClick}>{i18n("cmenu_settings")}</Dropdown.Item>
  </ul>
);

export default enhance(DropdownMenu);
