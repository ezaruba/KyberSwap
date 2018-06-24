import React from "react";
import { SelectAddressModal } from "../ImportAccount";
import { roundingNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"

const ImportByDeviceView = (props) => {

    function choosePath(dpath) {
        let formPath = document.getElementById('formPath'),
            selectedPath = dpath;
        if (!dpath) {
            selectedPath = formPath.customPath.value;
        }
        props.choosePath(selectedPath, dpath);
    }

    function getAddress(formAddress) {
        let data = {
                address: formAddress.addressString,
                type: props.walletType,
                path: props.currentDPath + '/' + formAddress.index,
            };

        props.getAddress(data);
    }

    function getCurrentList() {
        const addressLink = BLOCKCHAIN_INFO.ethScanUrl + 'address/';
        let currentListHtml = props.currentAddresses.map((address, index) => {
            return (
                <li key={address.addressString} onClick={() => getAddress(address)}>
                    <a class="name text-lowercase">
                        <label class="mb-0">
                            <span class="hash">{address.addressString}</span>
                        </label>
                    </a>
                    <div class="info">
                        <a class="link has-tip top explore" title={address.balance}>
                            {address.balance == '-1' ?
                                <img src={require('../../../assets/img/waiting-white.svg')} />
                                : roundingNumber(address.balance)
                            } ETH
                        </a>
                        <a class="import">
                            Import
                            <img src={require('../../../assets/img/import-account/arrow_right_orange.svg')}/>
                        </a>
                    </div>
                </li>
            )
        })
        return currentListHtml;
    }

    function getListPathHtml() {
        let listPath = props.dPath.map((dPath, index) => {
            let disabledPath = (props.walletType == 'ledger' && dPath.notSupport) ? true : false;
            let disabled = disabledPath? ' disabled' : ''
            let active = (props.currentDPath == dPath.path) ? 'active' : ''
            return (
                <div class= {"column" + disabled} key={dPath.path}>
                    <div className={"column-content " + active} onClick={() => {
                        if (dPath.path && !disabledPath) choosePath(dPath.path)
                    }}>
                        <input type="radio" name="path"
                            defaultValue={dPath.path}
                            disabled={disabledPath}
                        />
                        <label class={'address-path-stamp' + disabled}
                            for={'path-' + index}
                            style={disabledPath ? { opacity: .5 } : {}}>
                            {
                                dPath.path ? (
                                    <div>
                                        <div class="name">{dPath.path}</div>
                                        <div class="note">{dPath.desc}</div>
                                    </div>
                                ) : (
                                    <div>
                                        <div class="name">{dPath.desc}</div>
                                        <div class="address-path-input">
                                            <input type="text" name="customPath" defaultValue={dPath.defaultP} />
                                            {/* <a class="submit"
                                                style={{ display: 'block' }}
                                                onClick={() => choosePath(dPath.path)}
                                            ></a> */}
                                            <img src={require('../../../assets/img/import-account/arrow-down-orange.svg')} onClick={() => choosePath(dPath.path)}/>
                                        </div>
                                    </div>
                                )
                            }
                        </label>
                        <div className="choose-path-button">
                            <img src={require('../../../assets/img/import-account/arrow_right_orange.svg')} width="30" height="30" />
                        </div>
                    </div>
                </div>
            )
        })
        return listPath;
    }

    function getSelectAddressHtml() {
        return (
            <div>
                <div class="content">
                    <div class="row">
                        <div class="column">
                            <div class="block-title">
                                {props.translate("modal.select_hd_path") || "Select HD derivation path"}
                            </div>
                            <form id="formPath" onSubmit={(e) => e.preventDefault()}>
                                <div class="row small-up-2 medium-up-3 large-up-4 address-paths gutter-15">
                                    {getListPathHtml()}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="content white">
                    <div class="row">
                        <div class="column">
                            <div class="block-title">
                                {props.translate("modal.select_address") || "Select the address you would like to interact with"}
                            </div>
                            <ul class="address-list animated fadeIn">
                                {getCurrentList()}
                            </ul>
                            <div class="address-list-navigation animated fadeIn">
                                <a class={'previous ' + (props.isFirstList ? 'disabled' : '')} onClick={props.getPreAddress}>
                                    <img src={require('../../../assets/img/import-account/arrows_left_icon.svg')} />
                                    {props.translate("modal.previous_addresses") || "Previous Addresses"}
                                </a>
                                <a class="next" onClick={props.getMoreAddress}>
                                    {props.translate("modal.more_addresses") || "More Addresses"}
                                    <img src={require('../../../assets/img/import-account/arrows_right_icon.svg')} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return ([
        <div class="column column-block" key='coldwallet'>{props.content}</div>,
        <SelectAddressModal key="modal"
            isOpen={props.modalOpen}
            onRequestClose={props.onRequestClose}
            content={getSelectAddressHtml()}
            translate={props.translate}
            walletType={props.walletType}
        />

    ])
}

export default ImportByDeviceView