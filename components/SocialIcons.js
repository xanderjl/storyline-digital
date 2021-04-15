import { HStack, Icon } from "@chakra-ui/react"
import { IoLogoInstagram, IoLogoTiktok } from "react-icons/io5"
import {
  FaFacebookSquare,
  FaTwitter,
  FaBandcamp,
  FaSpotify,
  FaYoutube,
} from "react-icons/fa"
import { SiApplemusic } from "react-icons/si"
import { FiGlobe } from "react-icons/fi"
import Link from "./NextLink"

const iconStyles = {
  boxSize: 6,
}

const SocialIcons = ({ socials }) => {
  return (
    <HStack spacing={2} wrap="wrap">
      {socials?.website && (
        <Link href={socials?.website} isExternal>
          <Icon as={FiGlobe} {...iconStyles} />
        </Link>
      )}
      {socials?.instagram && (
        <Link href={socials?.instagram} isExternal>
          <Icon as={IoLogoInstagram} {...iconStyles} />
        </Link>
      )}
      {socials?.facebook && (
        <Link href={socials?.facebook} isExternal>
          <Icon as={FaFacebookSquare} {...iconStyles} />
        </Link>
      )}
      {socials?.twitter && (
        <Link href={socials?.twitter} isExternal>
          <Icon as={FaTwitter} {...iconStyles} />
        </Link>
      )}
      {socials?.bandcamp && (
        <Link href={socials?.bandcamp} isExternal>
          <Icon as={FaBandcamp} {...iconStyles} />
        </Link>
      )}
      {socials?.spotify && (
        <Link href={socials?.spotify} isExternal>
          <Icon as={FaSpotify} {...iconStyles} />
        </Link>
      )}
      {socials?.appleMusic && (
        <Link href={socials?.appleMusic} isExternal>
          <Icon as={SiApplemusic} {...iconStyles} />
        </Link>
      )}
      {socials?.tikTok && (
        <Link href={socials?.tikTok} isExternal>
          <Icon as={IoLogoTiktok} {...iconStyles} />
        </Link>
      )}
      {socials?.youtube && (
        <Link href={socials?.youtube} isExternal>
          <Icon as={FaYoutube} {...iconStyles} />
        </Link>
      )}
    </HStack>
  )
}

export default SocialIcons
