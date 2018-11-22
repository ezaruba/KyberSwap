import React from "react"
import { toT, roundingNumber } from "../../utils/converter"
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import * as analytics from "../../utils/analytics";
import { getAssetUrl } from "../../utils/common";

const TokenSelectorView = (props) => {
  var focusItem = props.listItem[props.focusItem]
  var listShow = {}
  Object.keys(props.listItem).map((key, i) => {
    var token = props.listItem[key],
      matchName = token.name.toLowerCase().includes(props.searchWord),
      matchSymbol = token.symbol.toLowerCase().includes(props.searchWord)
    if (matchSymbol || matchName) {
      listShow[key] = props.listItem[key]
    }
  })

  var getListToken = () => {
    return Object.keys(listShow).map((key, i) => {
      if (key !== props.focusItem) {
        var item = listShow[key]
        var balance = toT(item.balance, item.decimals)
        return (
          <div key={key} onClick={(e) => props.selectItem(e, item.symbol, item.address)} className="token-item">
            <div className="d-flex">
              <div className="item-icon">
                <img src={getAssetUrl(`tokens/${item.symbol}.svg`)} />
              </div>

              <div>
                <div>{item.name}</div>
                {props.type !== "des" &&
                <div className="item-balance">
                  {props.account !== false && (
                    <div title={balance} class="item-balance-value">
                      {`${roundingNumber(balance)} ${item.symbol}`}
                    </div>
                  )}
                </div>
                }
              </div>
            </div>
          </div>
        )
      }
    })
  }

  return (
    <div className="token-selector">
      <Dropdown onShow = {(e) => props.showTokens(e)} onHide = {(e) => props.hideTokens(e)}>
        <DropdownTrigger className="notifications-toggle">
          <div className="focus-item d-flex">
            <div className="d-flex">
              <div className="icon">
                <img src={getAssetUrl(`tokens/${focusItem.symbol}.svg`)} />
              </div>
              <div>
                <div className="focus-name">
                  <span className={"focus-name--desktop"}>{focusItem.name}</span>
                  <span className={"focus-name--mobile"}>{focusItem.symbol}</span>
                </div>
              </div>
            </div>
            <div><i className={'k k-angle bold ' + (props.open ? 'up' : 'down')}></i></div>
          </div>
        </DropdownTrigger>
        <DropdownContent>
          <div className="select-item">
            <div className="search-item">
              <input value={props.searchWord} placeholder={props.translate("try_dai") || `Try "DAI"`} onChange={(e) => props.changeWord(e)} type="text" onFocus={(e) => analytics.trackSearchToken()}/>
            </div>
            <div className="list-item custom-scroll">
              {getListToken()}
            </div>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  )

}
export default TokenSelectorView
