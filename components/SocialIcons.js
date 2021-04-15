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

const SocialIcons = ({ socials }) => {
  return (
    <HStack spacing={4} wrap="wrap">
      {socials?.website && (
        <Link href={socials?.website} isExternal>
          <Icon boxSize={8} as={FiGlobe} />
        </Link>
      )}
      {socials?.instagram && (
        <Link href={socials?.instagram} isExternal>
          <Icon boxSize={8} as={IoLogoInstagram} />
        </Link>
      )}
      {socials?.facebook && (
        <Link href={socials?.facebook} isExternal>
          <Icon boxSize={8} as={FaFacebookSquare} />
        </Link>
      )}
      {socials?.twitter && (
        <Link href={socials?.twitter} isExternal>
          <Icon boxSize={8} as={FaTwitter} />
        </Link>
      )}
      {socials?.bandcamp && (
        <Link href={socials?.bandcamp} isExternal>
          <Icon boxSize={8} as={FaBandcamp} />
        </Link>
      )}
      {socials?.spotify && (
        <Link href={socials?.spotify} isExternal>
          <Icon boxSize={8} as={FaSpotify} />
        </Link>
      )}
      {socials?.appleMusic && (
        <Link href={socials?.appleMusic} isExternal>
          <Icon boxSize={8} as={SiApplemusic} />
        </Link>
      )}
      {socials?.tikTok && (
        <Link href={socials?.tikTok} isExternal>
          <Icon boxSize={8} as={IoLogoTiktok} />
        </Link>
      )}
      {socials?.youtube && (
        <Link href={socials?.youtube} isExternal>
          <Icon boxSize={8} as={FaYoutube} />
        </Link>
      )}
    </HStack>
  )
}

export default SocialIcons
