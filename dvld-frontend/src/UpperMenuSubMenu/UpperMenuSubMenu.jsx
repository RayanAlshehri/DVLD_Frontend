import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import styles from './UpperMenuSubMenu.module.css';

function UpperMenuSubMenu({ menuItems }) {
    const [itemsToRender, setItemsToRender] = useState([menuItems]);
    const [currentItem, setCurrentItem] = useState(null);

    function doesItemExistInArray(item) {
        for (let i = 0; i < itemsToRender.length; i++) {
            if (itemsToRender[i] == item)
                return true;
        }

        return false;
    }

    function isMainItem(item){
        for (let i = 0; i < menuItems.length; i++) {
            if (menuItems[i] == item)
                return true;
        }

        return false;
    }

    const handleItemMouseOn = (item) => {
        if (currentItem && currentItem != item && isMainItem(item)) {
            setItemsToRender([menuItems])
            setCurrentItem(item);
        }

        if (item.subItems && item.subItems.length > 0 && !doesItemExistInArray(item.subItems)) {
            setItemsToRender((prevItems) => [...prevItems, item.subItems]);

            if (isMainItem(item))
                setCurrentItem(item);
        }
    }

    const handleItemClick = (item) => {
        item.onClick?.();
    }

  return (
    <div className={styles["sub-menu-container"]}>
          {itemsToRender.map(items => (
              <div className={styles["items-container"]}>
                  {items.map(i => i.subItems.length == 0
                      ? <div onClick={() => handleItemClick(i)} onMouseOver={() => handleItemMouseOn(i)} className={styles["menu-item"]}>{i.text}</div>
                      : <div onClick={() => handleItemClick(i)} onMouseOver={() => handleItemMouseOn(i)} className={styles["menu-item"]}>{i.text}<FontAwesomeIcon icon={faCaretRight} className={styles["icon-arrow"]} /></div>)}
              </div>

          ))}
      </div>
  );
}

export default UpperMenuSubMenu;
