"use client";
import React, { useState, useEffect } from "react";

import { request, response, models } from "@/wailsjs/wailsjs/go/models";
import TitleRoundedIcon from "@mui/icons-material/TitleRounded";
import { PasswordDecrypt } from "@/wailsjs/wailsjs/go/app/App";
import { GetAllPasswords } from "@/wailsjs/wailsjs/go/app/App";
import { DoSetPasswordSettings } from "@/wailsjs/wailsjs/go/app/App";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  faGoogle,
  faFacebookF,
  faInstagram,
  faDiscord,
  faYoutube,
  faPaypal,
  faFigma,
  faBehance,
  faTwitch,
  faXTwitter,
  faSteam,
  faTiktok,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import GppMaybeRoundedIcon from "@mui/icons-material/GppMaybeRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import GppGoodRoundedIcon from "@mui/icons-material/GppGoodRounded";
import { GetAllCredentialsByGroup } from "@/wailsjs/wailsjs/go/app/App";
import { GetPasswordById } from "@/wailsjs/wailsjs/go/app/App";
interface EditGroupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  groupKey: string;
  activeGroupId: string;
}

const SvgLogos: { [key: string]: any } = {
  google: faGoogle,
  facebook: faFacebookF,
  instagram: faInstagram,
  youtube: faYoutube,
  paypal: faPaypal,
  figma: faFigma,
  behance: faBehance,
  twitter: faXTwitter,
  x: faXTwitter,
  steam: faSteam,
  tiktok: faTiktok,
  github: faGithub,
  discord: faDiscord,
  default: faLock,
};

const EditGroup: React.FC<EditGroupProps> = ({
  onClose,
  userName,
  isOpen,
  groupKey,
  activeGroupId,
}) => {
  const [allPasswords, setAllPasswords] = useState<models.Password[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [id, setId] = useState("");
  const [titlee, setTitlee] = useState("");
  const [icon, setIcon] = useState("");
  const [allGroups, setAllGroups] = useState<{
    [key: string]: models.Password[];
  }>({});
  const [group, setGroup] = useState(groupKey);

  const titlesearch = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTitlee(event.target.value);
  };

  async function getPasswords() {
    try {
      const response = await GetAllPasswords(userName);
      setAllPasswords(response);
    } catch (error) {
      console.error("Error fetching passwords:", error, userName);
    }
  }
  async function GetAllGroups() {
    try {
      const response = await GetAllCredentialsByGroup(userName);
      setAllGroups(response);
    } catch (e) {
      console.log("Error in GetAllGroups: ", e);
    }
  }
  useEffect(() => {
    getPasswords();
    if (isOpen) {
      console.log("isOpen");
      GetAllGroups();
    }
  }, [isOpen]);

  const getFontAwesomeIcon = (iconName: string) => {
    const search = iconName.toLowerCase();
    const matchingKey: any = Object.keys(SvgLogos).find((key) =>
      key.startsWith(search)
    );
    return SvgLogos[matchingKey] || null; // Devuelve null o el ícono correspondiente
  };

  const PassData = new models.Settings({
    favorite: favorite,
    group: group,
    icon: "",
    status: "",
  });
  async function EditPass(passwordId: string) {
    try {
      console.log(
        "edit: " + userName + " id: " + passwordId + " group: " + group
      );

      const response = await DoSetPasswordSettings(
        userName,
        passwordId,
        PassData
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  async function getPassword(passwordId: string) {
    try {
      console.log("Dentro edit: " + userName + " id: " + passwordId);
      const response = await GetPasswordById(userName, passwordId);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }
  const addPassword = async (event: React.FormEvent, passwordId: string) => {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario
    setGroup(groupKey);
    try {
      await EditPass(passwordId); // Pasas `passwordId` directamente a `EditPass`
      // Si necesitas obtener información de la contraseña, asegúrate de esperar a que se complete también
      await getPassword(passwordId);
      // Después de agregar la contraseña y realizar todas las operaciones necesarias, actualiza los grupos
      await GetAllGroups();
      await getPasswords();
    } catch (error) {
      console.error("Hubo un error al añadir la contraseña:", error);
    }
  };
  const deletePassword = async (event: React.FormEvent, passwordId: string) => {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario
    setGroup("default");
    try {
      await EditPass(passwordId); // Pasas `passwordId` directamente a `EditPass`
      // Si necesitas obtener información de la contraseña, asegúrate de esperar a que se complete también
      await getPassword(passwordId);
      // Después de agregar la contraseña y realizar todas las operaciones necesarias, actualiza los grupos
      await GetAllGroups();
      await getPasswords();
    } catch (error) {
      console.error("Hubo un error al eliminar la contraseña:", error);
    }
  };
  const searchPasswords = allPasswords.filter(
    (password) =>
      password.title.toLowerCase().includes(titlee.toLowerCase()) &&
      password.settings.group !== groupKey // Excluye contraseñas con un groupKey coincidente
  );



  return (
    <>
      {isOpen ? (
        <div className="absolute flex justify-center items-center right-0 top-0 h-screen w-screen">
          <div
            onClick={onClose}
            className="absolute bg-[#000000] opacity-80 h-screen w-screen"
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col justify-startitems-center dark:bg-darkgray bg-white w-[57rem] h-[75%]  p-12 rounded-lg z-10 dark:text-whitebg text-darkgray space-y-4"
          >
            <div className="font-bold text-2xl w-full ">{groupKey}</div>
            {activeGroupId === groupKey && allGroups[groupKey] && (
              <div className="mt-6 ">
                {allGroups[groupKey]
                  .filter((password) => password.title !== "")
                  .map((password, index) => (
                    <div key={index} className="flex justify-between w-full ">
                      <div
                        onChange={() => {
                          setIcon(password.settings.icon);
                        }}
                        className="flex w-full h-[5.74rem] py-5  rounded-lg  cursor-pointer"
                      >
                        <div className="flex items-center  space-x-5 w-3/5 ">
                          <div className="rounded-lg bg-whitebg dark:bg-black dark:text-whitebg text-darkgray w-20 h-full flex items-center justify-center text-2xl">
                            <FontAwesomeIcon
                              icon={getFontAwesomeIcon(password.settings.icon)}
                            />
                          </div>
                          <div className="flex-col text-lg">
                            <div className="font-bold text-primary">
                              {password.title}
                            </div>
                            <div className="dark:text-gray text-blackwhite text-base font-medium hover:text-whitegray">
                              {password.username}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center  w-2/6   ">
                          <div className="group  ">
                            <input
                              readOnly
                              type="password"
                              value={59238798432}
                              maxLength={20}
                              className=" dark:text-whitebg text-darkgray w-24 focus:outline-none cursor-pointer bg-transparent  inline-block  "
                            />
                          </div>
                        </div>
                        <div className="flex items-center w-4/12 ">
                          <div
                            className={`flex items-center justify-center h-10  max-xl:px-2 font-semibold ${
                              password.settings.status == "Strong"
                                ? "  text-primary"
                                : password.settings.status == "Medium"
                                ? " text-primary"
                                : "text-red "
                            } `}
                          >
                            {password.settings.status == "Strong" ? (
                              <GppGoodRoundedIcon />
                            ) : password.settings.status == "Medium" ? (
                              <ShieldRoundedIcon />
                            ) : (
                              <GppMaybeRoundedIcon />
                            )}
                            <div className="flex">
                              {password.settings.status == "Strong"
                                ? "Strong"
                                : password.settings.status == "Strong"
                                ? "Medium"
                                : "Weak"}
                            </div>
                          </div>
                        </div>
                        <div className="flex h-full items-center w-1/6">
                          <button
                            onClick={(event) => {
                              // Prevent the default form submission event
                              event.preventDefault();
                              // Call addPassword with both the event and the ID as arguments
                              deletePassword(event, password.id);
                            }}
                            className="hover:bg-whitegray h-12 w-12 rounded-full"
                          >
                            x
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex items-center w-full   ">
              <SearchRoundedIcon
                sx={{ fontSize: 24 }}
                className="absolute ml-5 text-primary"
              />
              <input
                value={titlee}
                onChange={titlesearch}
                type="text"
                className="flex rounded-full dark:text-whitebg text-darkgray  pl-14 min-w-[25rem] w-[65%] h-12 dark:bg-darkgray bg-whitebg font-medium focus:outline-none placeholder:text-blackwhite dark:placeholder-gray"
                placeholder="Buscar"
              />
            </div>

            {searchPasswords.map((password, index) => (
              <div key={index} className="w-full ">
                <div
                  onChange={() => {
                    setIcon(password.settings.icon);
                  }}
                  className="flex w-full h-[5.74rem] py-5  rounded-lg  cursor-pointer"
                >
                  <div className="flex items-center  space-x-5 w-3/5 ">
                    <div className="rounded-lg bg-whitebg dark:bg-black dark:text-whitebg text-darkgray w-20 h-full flex items-center justify-center text-2xl">
                      <FontAwesomeIcon
                        icon={getFontAwesomeIcon(password.settings.icon)}
                      />
                    </div>
                    <div className="flex-col text-lg">
                      <div className="font-bold text-primary">
                        {password.title}
                      </div>
                      <div className="dark:text-gray text-blackwhite text-base font-medium hover:text-whitegray">
                        {password.username}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center  w-2/6   ">
                    <div className="group  ">
                      <input
                        readOnly
                        type="password"
                        value={59238798432}
                        maxLength={20}
                        className=" dark:text-whitebg text-darkgray w-24 focus:outline-none cursor-pointer bg-transparent  inline-block  "
                      />
                    </div>
                  </div>
                  <div className="flex items-center w-4/12 ">
                    <div
                      className={`flex items-center justify-center h-10  max-xl:px-2 font-semibold ${
                        password.settings.status == "Strong"
                          ? "  text-primary"
                          : password.settings.status == "Medium"
                          ? " text-primary"
                          : "text-red "
                      } `}
                    >
                      {password.settings.status == "Strong" ? (
                        <GppGoodRoundedIcon />
                      ) : password.settings.status == "Medium" ? (
                        <ShieldRoundedIcon />
                      ) : (
                        <GppMaybeRoundedIcon />
                      )}
                      <div className="flex">
                        {password.settings.status == "Strong"
                          ? "Strong"
                          : password.settings.status == "Strong"
                          ? "Medium"
                          : "Weak"}
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full items-center w-1/6">
                    <button
                      onClick={(event) => {
                        // Prevent the default form submission event
                        event.preventDefault();
                        // Call setId to update the state with the new ID
                        setId(password.id);
                        // Call addPassword with both the event and the ID as arguments
                        addPassword(event, password.id);
                      }}
                      className="bg-primary h-12 w-12 rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="h-0.5 w-[95%] dark:bg-gray bg-blackwhite rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default EditGroup;
